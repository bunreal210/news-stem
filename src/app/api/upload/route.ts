export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { uploadAnyFile } from '@/lib/cloudflare-r2';

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Chưa được cấp quyền tải tệp.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy tệp tải lên.' }, { status: 400 });
    }

    // Các định dạng tệp được phép tải lên
    const allowedExtensions = [
      'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg',
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
      'zip', 'rar', '7z', 'txt', 'csv'
    ];

    const fileName = file.name || 'file';
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const isImage = file.type.startsWith('image/');

    if (!isImage && !allowedExtensions.includes(ext)) {
      return NextResponse.json(
        {
          error: `Định dạng tệp .${ext} không được hỗ trợ. Vui lòng chọn tệp ảnh (JPG, PNG, WEBP...) hoặc tài liệu (PDF, Word, Excel, PowerPoint, ZIP).`,
        },
        { status: 400 }
      );
    }

    const uploadRes = await uploadAnyFile(file);

    return NextResponse.json({
      success: true,
      url: uploadRes.url,
      filename: uploadRes.filename,
      originalName: uploadRes.originalName,
      size: uploadRes.sizeFormatted,
      sizeBytes: uploadRes.sizeBytes,
      fileType: uploadRes.extension || (isImage ? 'IMG' : 'DOC'),
    });
  } catch (error: any) {
    console.error('Lỗi khi xử lý tải tệp:', error);
    return NextResponse.json(
      { error: error?.message || 'Lỗi tải tệp lên hệ thống lưu trữ.' },
      { status: 500 }
    );
  }
}
