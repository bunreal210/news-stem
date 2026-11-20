import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, setAdminSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    await setAdminSession();
    return NextResponse.json({ success: true, message: 'Đăng nhập thành công!' });
  } catch (error) {
    console.error('Lỗi login:', error);
    return NextResponse.json({ error: 'Đã có lỗi xảy ra từ máy chủ.' }, { status: 500 });
  }
}
