import React from 'react';
import PostForm from '@/components/PostForm';
import { PlusCircle, Bell, Newspaper } from 'lucide-react';

interface NewPostPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const { category } = await searchParams;
  const isNotice = category === 'Thong-bao';

  return (
    <div className="bg-slate-50/60 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isNotice ? 'text-red-600' : 'text-blue-600'}`}>
            {isNotice ? <Bell className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
            {isNotice ? 'Soạn thảo thông báo mới' : 'Tạo bài viết mới'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-tech">
            {isNotice ? 'Đăng Thông Báo & Kế Hoạch Hoạt Động' : 'Đăng Tin Tức Hoạt Động & Nghiên Cứu STEM'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isNotice
              ? 'Điền tiêu đề thông báo, nội dung chỉ đạo, chọn mức độ khẩn và đính kèm file văn bản tải về.'
              : 'Điền đầy đủ thông tin, tải ảnh bìa và dán link YouTube (nếu có) để chia sẻ tới toàn thể học sinh và phụ huynh.'}
          </p>
        </div>

        <PostForm defaultCategory={category} />
      </div>
    </div>
  );
}
