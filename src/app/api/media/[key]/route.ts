export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getR2 } from '@/lib/cloudflare-r2';
import { getD1 } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const decodedKey = decodeURIComponent(key);

    // 1. Thử lấy tệp từ Cloudflare R2 Bucket
    const r2 = getR2();
    if (r2) {
      try {
        const object = await r2.get(decodedKey);
        if (object) {
          const headers = new Headers();
          object.writeHttpMetadata(headers);
          headers.set('etag', object.httpEtag);
          headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          return new NextResponse(object.body, { headers });
        }
      } catch (err) {
        console.error('[GET /api/media/[key]] R2 get error:', err);
      }
    }

    // 2. Thử lấy tệp từ bảng media_files trong Cloudflare D1
    const d1 = getD1();
    if (d1) {
      try {
        const fileRow: any = await d1
          .prepare('SELECT * FROM media_files WHERE filename = ? OR id = ?')
          .bind(decodedKey, decodedKey)
          .first();

        if (fileRow && fileRow.data) {
          const binaryString = atob(fileRow.data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const mimeType = fileRow.mime_type || 'application/octet-stream';
          const isImage = mimeType.startsWith('image/');
          const filename = fileRow.filename || decodedKey;

          return new NextResponse(bytes, {
            headers: {
              'Content-Type': mimeType,
              'Content-Disposition': isImage
                ? 'inline'
                : `attachment; filename="${encodeURIComponent(filename)}"`,
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          });
        }
      } catch (err) {
        console.error('[GET /api/media/[key]] D1 media_files error:', err);
      }
    }

    return new NextResponse('Tệp không tồn tại trên hệ thống lưu trữ.', { status: 404 });
  } catch (error) {
    console.error('[GET /api/media/[key]] Lỗi server:', error);
    return new NextResponse('Lỗi máy chủ khi tải tệp.', { status: 500 });
  }
}
