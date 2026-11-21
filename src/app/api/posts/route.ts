export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPosts, createPost, getD1 } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'published'; // mặc định chỉ lấy published cho khách
    const limit = searchParams.get('limit');

    let posts = await getPosts();

    // Lọc theo trạng thái (nếu không phải admin hỏi all)
    if (status !== 'all') {
      posts = posts.filter((p) => p.status === status);
    }

    // Lọc theo danh mục
    if (category && category !== 'Tat-ca') {
      posts = posts.filter((p) => p.category === category);
    }

    // Tìm kiếm từ khóa theo tiêu đề hoặc tóm tắt hoặc nội dung
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }

    // Giới hạn số lượng bài viết nếu có
    if (limit) {
      const n = parseInt(limit, 10);
      if (!isNaN(n) && n > 0) {
        posts = posts.slice(0, n);
      }
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách posts:', error);
    return NextResponse.json({ error: 'Không thể lấy dữ liệu bài viết.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Bạn không có quyền thực hiện thao tác này.' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      title, 
      summary, 
      content, 
      category, 
      thumbnail, 
      youtubeUrl, 
      gallery, 
      author, 
      featured, 
      status,
      isPinned,
      isUrgent,
      attachments 
    } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Tiêu đề, nội dung và danh mục là các trường bắt buộc.' },
        { status: 400 }
      );
    }

    // Kiểm tra D1 binding trước khi tạo bài
    const d1 = getD1();
    const d1Available = !!d1;

    const newPost = await createPost({
      title,
      slug: '',
      summary: summary || '',
      content,
      category,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      youtubeUrl: youtubeUrl || '',
      gallery: gallery || [],
      author: author || 'CLB STEM',
      featured: Boolean(featured),
      isPinned: Boolean(isPinned),
      isUrgent: Boolean(isUrgent),
      attachments: attachments || [],
      status: status === 'draft' ? 'draft' : 'published',
    });

    // Revalidate public portal and admin pages immediately
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/posts');
      revalidatePath('/admin/dashboard');
    } catch (revalErr) {
      console.warn('[POST /api/posts] revalidatePath warning:', revalErr);
    }

    return NextResponse.json({ 
      success: true, 
      post: newPost,
      d1_connected: d1Available,
      message: d1Available 
        ? `Bài viết "${newPost.title}" đã được lưu vào cơ sở dữ liệu thành công.`
        : `Bài viết "${newPost.title}" đã được lưu vào bộ nhớ tạm (D1 chưa kết nối).`
    }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/posts] CRITICAL ERROR:', error);
    const errMsg = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo bài viết.';
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
