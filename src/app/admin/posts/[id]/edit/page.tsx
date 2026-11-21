import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { getPostById } from '@/lib/db';
import PostForm from '@/components/PostForm';
import { Edit, Bell } from 'lucide-react';

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditPostPage({ params }: EditPostPageProps) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin');
  }

  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  const isNotice = post.category === 'Thong-bao';

  return (
    <div className="bg-slate-50/60 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isNotice ? 'text-red-600' : 'text-amber-600'}`}>
            {isNotice ? <Bell className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
            {isNotice ? 'Cập nhật thông báo' : 'Cập nhật bài viết'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-tech">
            {isNotice ? 'Chỉnh Sửa Thông Báo & Kế Hoạch' : 'Chỉnh Sửa Bài Viết Hoạt Động'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cập nhật tiêu đề, danh mục, mức độ khẩn, file tài liệu đính kèm hoặc nội dung chi tiết.
          </p>
        </div>

        <PostForm initialData={post} isEdit={true} />
      </div>
    </div>
  );
}
