export const runtime = 'edge';

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
    const post = await getPostById(id);
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

    const updated = await updatePost(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết để cập nhật.' }, { status: 404 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/posts');
      revalidatePath('/admin/dashboard');
    } catch {}

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error('[PUT /api/posts/[id]] CRITICAL ERROR:', error);
    const errMsg = error instanceof Error ? error.message : 'Lỗi máy chủ khi cập nhật bài viết.';
    return NextResponse.json({ error: errMsg }, { status: 500 });
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
    const ok = await deletePost(id);
    if (!ok) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết để xóa.' }, { status: 404 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/posts');
      revalidatePath('/admin/dashboard');
    } catch {}

    return NextResponse.json({ success: true, message: 'Đã xóa bài viết thành công.' });
  } catch (error) {
    console.error('[DELETE /api/posts/[id]] CRITICAL ERROR:', error);
    const errMsg = error instanceof Error ? error.message : 'Lỗi máy chủ khi xóa bài viết.';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await incrementViews(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Không thể tăng lượt xem.' }, { status: 500 });
  }
}
