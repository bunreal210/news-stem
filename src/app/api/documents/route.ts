export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getDocumentResources, createDocument } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const docs = getDocumentResources();
    return NextResponse.json({ documents: docs });
  } catch (error) {
    console.error('Lỗi lấy tài liệu:', error);
    return NextResponse.json({ error: 'Không thể tải danh sách tài liệu.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Bạn không có quyền thực hiện thao tác này.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, code, category, fileType, fileSize, downloadUrl } = body;

    if (!title || !code || !fileType) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc của văn bản.' }, { status: 400 });
    }

    const newDoc = createDocument({
      title,
      code,
      category: category || 'Biểu mẫu',
      fileType: fileType.toUpperCase(),
      fileSize: fileSize || '1.0 MB',
      publishDate: new Date().toLocaleDateString('vi-VN'),
      downloadUrl: downloadUrl || '#',
    });

    return NextResponse.json({ success: true, document: newDoc }, { status: 201 });
  } catch (error) {
    console.error('Lỗi tạo tài liệu:', error);
    return NextResponse.json({ error: 'Lỗi khi lưu tài liệu.' }, { status: 500 });
  }
}
