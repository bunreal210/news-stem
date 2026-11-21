import { getRequestContext } from '@cloudflare/next-on-pages';
import { getD1 } from './db';

export interface R2Bucket {
  put: (key: string, value: any, options?: any) => Promise<any>;
  get: (key: string) => Promise<any>;
}

export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  sizeBytes: number;
  sizeFormatted: string;
  mimeType: string;
  extension: string;
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Lấy Cloudflare R2 bucket binding từ mọi môi trường (Edge Runtime / Cloudflare Pages)
 */
export function getR2(): R2Bucket | null {
  // 1. Kiểm tra trực tiếp qua Symbol RequestContext của Cloudflare
  try {
    const symbol = Symbol.for('__cloudflare-request-context__');
    const directCtx = (globalThis as any)[symbol];
    if (directCtx && directCtx.env) {
      const env = directCtx.env as any;
      if (env.R2_BUCKET) return env.R2_BUCKET;
      if (env.BUCKET) return env.BUCKET;
      if (env.MEDIA_BUCKET) return env.MEDIA_BUCKET;
      if (env.stem_club_media) return env.stem_club_media;
    }
  } catch {}

  // 2. Kiểm tra qua helper getRequestContext() của @cloudflare/next-on-pages
  try {
    const ctx = getRequestContext();
    if (ctx && ctx.env) {
      const env = ctx.env as any;
      if (env.R2_BUCKET) return env.R2_BUCKET;
      if (env.BUCKET) return env.BUCKET;
      if (env.MEDIA_BUCKET) return env.MEDIA_BUCKET;
      if (env.stem_club_media) return env.stem_club_media;
    }
  } catch {}

  // 3. Kiểm tra binding trên globalThis
  try {
    if (typeof globalThis !== 'undefined') {
      const g = globalThis as any;
      if (g.R2_BUCKET) return g.R2_BUCKET;
      if (g.__env__ && g.__env__.R2_BUCKET) return g.__env__.R2_BUCKET;
    }
  } catch {}

  // 4. Kiểm tra qua process.env
  try {
    if (typeof process !== 'undefined' && process.env) {
      const p = process.env as any;
      if (p.R2_BUCKET) return p.R2_BUCKET;
    }
  } catch {}

  return null;
}

/**
 * Tải file (ảnh hoặc tài liệu) lên R2 hoặc D1 media_files
 */
export async function uploadAnyFile(file: File): Promise<UploadResult> {
  const dotIndex = file.name.lastIndexOf('.');
  const ext = dotIndex !== -1 ? file.name.substring(dotIndex).toLowerCase() : '';
  const rawBase = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
  const cleanName = rawBase.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
  const uniqueKey = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${cleanName}${ext}`;
  const mimeType = file.type || 'application/octet-stream';
  const sizeBytes = file.size;
  const sizeFormatted = formatFileSize(sizeBytes);

  // 1. Ưu tiên tải lên Cloudflare R2
  const r2 = getR2();
  if (r2) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      await r2.put(uniqueKey, arrayBuffer, {
        httpMetadata: {
          contentType: mimeType,
          contentDisposition: mimeType.startsWith('image/')
            ? 'inline'
            : `attachment; filename="${encodeURIComponent(file.name)}"`,
        },
      });

      const publicDomain = process.env.NEXT_PUBLIC_R2_URL;
      const fileUrl = publicDomain
        ? `${publicDomain.replace(/\/$/, '')}/${uniqueKey}`
        : `/api/media/${encodeURIComponent(uniqueKey)}`;

      return {
        url: fileUrl,
        filename: uniqueKey,
        originalName: file.name,
        sizeBytes,
        sizeFormatted,
        mimeType,
        extension: ext.replace('.', '').toUpperCase(),
      };
    } catch (err) {
      console.error('[uploadAnyFile] Lỗi lưu lên R2, chuyển sang fallback D1:', err);
    }
  }

  // 2. Fallback: Lưu vào Cloudflare D1 (bảng media_files)
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  const d1 = getD1();
  if (d1) {
    try {
      await d1
        .prepare(`
          INSERT INTO media_files (id, filename, mime_type, size_bytes, data)
          VALUES (?, ?, ?, ?, ?)
        `)
        .bind(uniqueKey, uniqueKey, mimeType, sizeBytes, base64)
        .run();

      return {
        url: `/api/media/${encodeURIComponent(uniqueKey)}`,
        filename: uniqueKey,
        originalName: file.name,
        sizeBytes,
        sizeFormatted,
        mimeType,
        extension: ext.replace('.', '').toUpperCase(),
      };
    } catch (d1Err) {
      console.error('[uploadAnyFile] Lỗi lưu vào D1 media_files:', d1Err);
    }
  }

  // 3. Fallback cuối cùng: Data URI nếu là ảnh
  const dataUri = `data:${mimeType};base64,${base64}`;
  return {
    url: mimeType.startsWith('image/') ? dataUri : `/api/media/${encodeURIComponent(uniqueKey)}`,
    filename: uniqueKey,
    originalName: file.name,
    sizeBytes,
    sizeFormatted,
    mimeType,
    extension: ext.replace('.', '').toUpperCase(),
  };
}

/**
 * Tương thích ngược: tải ảnh và trả về url
 */
export async function uploadImageFile(file: File): Promise<string> {
  const result = await uploadAnyFile(file);
  return result.url;
}
