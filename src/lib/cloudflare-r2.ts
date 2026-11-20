import path from 'path';
import fs from 'fs';

interface R2Bucket {
  put: (key: string, value: any, options?: any) => Promise<any>;
  get: (key: string) => Promise<any>;
}

function getR2Binding(): R2Bucket | null {
  try {
    // @ts-ignore
    if (typeof globalThis !== 'undefined' && globalThis.R2_BUCKET) {
      // @ts-ignore
      return globalThis.R2_BUCKET as R2Bucket;
    }
    // @ts-ignore
    if (process.env.R2_BUCKET) {
      // @ts-ignore
      return process.env.R2_BUCKET as R2Bucket;
    }
  } catch {}
  return null;
}

/**
 * Tải file lên Cloudflare R2 (hoặc local fallback nếu đang chạy dev)
 */
export async function uploadImageFile(file: File): Promise<string> {
  const ext = path.extname(file.name) || '.jpg';
  const cleanName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '');
  const filename = `${Date.now()}-${cleanName}${ext}`;

  const r2 = getR2Binding();

  // 1. Nếu có Cloudflare R2: Lưu trực tiếp lên Cloudflare Bucket
  if (r2) {
    const arrayBuffer = await file.arrayBuffer();
    await r2.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || 'image/jpeg',
      },
    });

    // Nếu bạn có gắn Custom Domain cho R2 (ví dụ: media.clbstem.com)
    const publicDomain = process.env.NEXT_PUBLIC_R2_URL;
    if (publicDomain) {
      return `${publicDomain.replace(/\/$/, '')}/${filename}`;
    }

    // Hoặc trả về qua endpoint phục vụ ảnh
    return `/api/media/${filename}`;
  }

  // 2. Chế độ cục bộ (Local Development)
  const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filePath = path.join(UPLOAD_DIR, filename);
  fs.writeFileSync(filePath, buffer);

  return `/uploads/${filename}`;
}
