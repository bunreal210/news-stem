export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { deleteDocument } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Bạn không có quyền thực hiện thao tác này.' }, { status: 401 });
    }

    const { id } = await params;
    const ok = deleteDocument(id);
    if (!ok) {
      return NextResponse.json({ error: 'Không tìm thấy văn bản để xóa.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Đã xóa văn bản thành công.' });
  } catch (error) {
    console.error('Lỗi xóa tài liệu:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ.' }, { status: 500 });
  }
}
