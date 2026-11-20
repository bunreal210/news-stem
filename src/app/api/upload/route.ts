export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { uploadImageFile } from '@/lib/cloudflare-r2';

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Chưa được cấp quyền tải tệp.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy tệp đính kèm.' }, { status: 400 });
    }

    // Kiểm tra định dạng ảnh
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Chỉ chấp nhận các định dạng ảnh: JPG, PNG, WEBP, GIF, SVG.' },
        { status: 400 }
      );
    }

    const publicUrl = await uploadImageFile(file);
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Lỗi khi tải ảnh:', error);
    return NextResponse.json({ error: 'Lỗi tải ảnh lên hệ thống lưu trữ.' }, { status: 500 });
  }
}
