import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPostById, updatePost, deletePost, incrementViews } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = getPostById(id);
    if (!post) {
      return NextResponse.json({ error: 'Bài viết không tồn tại.' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Lỗi lấy bài viết:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ.' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Bạn không có quyền thực hiện thao tác này.' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await req.json();

    const updated = updatePost(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết để cập nhật.' }, { status: 404 });
    }

    // Revalidate public pages and dashboard
    revalidatePath('/', 'layout');
    revalidatePath('/posts');
    revalidatePath('/admin/dashboard');

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error('Lỗi cập nhật bài viết:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ.' }, { status: 500 });
  }
}

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
    const ok = deletePost(id);
    if (!ok) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết để xóa.' }, { status: 404 });
    }

    // Revalidate public pages and dashboard
    revalidatePath('/', 'layout');
    revalidatePath('/posts');
    revalidatePath('/admin/dashboard');

    return NextResponse.json({ success: true, message: 'Đã xóa bài viết thành công.' });
  } catch (error) {
    console.error('Lỗi xóa bài viết:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ.' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    incrementViews(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Không thể tăng lượt xem.' }, { status: 500 });
  }
}
