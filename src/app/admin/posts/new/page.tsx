import React from 'react';
import PostForm from '@/components/PostForm';
import { PlusCircle } from 'lucide-react';

export default function NewPostPage() {
  return (
    <div className="bg-slate-50/60 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5" />
            Tạo nội dung mới
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Đăng Bài Viết Hoạt Động CLB STEM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Điền đầy đủ thông tin, tải ảnh và dán link YouTube (nếu có) để chia sẻ hoạt động tới mọi người.
          </p>
        </div>

        <PostForm />
      </div>
    </div>
  );
}
