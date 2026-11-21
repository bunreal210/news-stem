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
 * Tải file lên Cloudflare R2 (hoặc base64 fallback)
 */
export async function uploadImageFile(file: File): Promise<string> {
  const dotIndex = file.name.lastIndexOf('.');
  const ext = dotIndex !== -1 ? file.name.substring(dotIndex) : '.jpg';
  const rawBase = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
  const cleanName = rawBase.replace(/[^a-zA-Z0-9_-]/g, '');
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

    const publicDomain = process.env.NEXT_PUBLIC_R2_URL;
    if (publicDomain) {
      return `${publicDomain.replace(/\/$/, '')}/${filename}`;
    }

    return `/api/media/${filename}`;
  }

  // 2. Chế độ Edge / Local: chuyển sang Data URL hoặc placeholder
  try {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${file.type || 'image/jpeg'};base64,${base64}`;
  } catch {
    return '';
  }
}
