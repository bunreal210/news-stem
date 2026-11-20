import React from 'react';
import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/db';
import PostForm from '@/components/PostForm';
import { Edit } from 'lucide-react';

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 0;

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-slate-50/60 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
            <Edit className="w-3.5 h-3.5" />
            Cập nhật nội dung
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Chỉnh Sửa Bài Viết
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Cập nhật tiêu đề, thay đổi ảnh bìa, link video YouTube hoặc nội dung bài viết.
          </p>
        </div>

        <PostForm initialData={post} isEdit={true} />
      </div>
    </div>
  );
}
