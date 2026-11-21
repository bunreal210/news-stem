import React from 'react';
import { getPosts } from '@/lib/db';
import PostCard from '@/components/PostCard';
import { CATEGORIES } from '@/lib/types';
import Link from 'next/link';
import { Search, FolderOpen, Newspaper, Bell, Sparkles } from 'lucide-react';

interface PostsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { category = 'Tat-ca', search = '' } = await searchParams;

  let posts = getPosts().filter((p) => p.status === 'published');

  if (category && category !== 'Tat-ca') {
    posts = posts.filter((p) => p.category === category);
  }

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
    );
  }

  const isThongBao = category === 'Thong-bao';
  const newsCategories = CATEGORIES.filter((c) => c.id !== 'Thong-bao');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          {isThongBao ? (
            <>
              <Bell className="w-3.5 h-3.5 text-red-600" />
              <span>Chuyên mục Thông Báo & Kế Hoạch</span>
            </>
          ) : (
            <>
              <Newspaper className="w-3.5 h-3.5 text-blue-600" />
              <span>Kho Tin Tức & Bài Viết BSSRC</span>
            </>
          )}
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-tech">
          {isThongBao ? 'Bảng Thông Báo & Kế Hoạch' : 'Tin Tức & Toàn Bộ Bài Viết'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          {isThongBao 
            ? 'Theo dõi các thông báo triệu tập, lịch thi đấu KHKT, kế hoạch sinh hoạt và văn bản điều hành của CLB.' 
            : 'Tổng hợp toàn bộ các bài viết nghiên cứu, sáng chế robot, giải thưởng, học liệu và hoạt động trải nghiệm STEM.'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Search Input */}
        <form method="GET" action="/posts" className="relative">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder={isThongBao ? "Tìm kiếm thông báo, kế hoạch..." : "Tìm kiếm bài viết, đề tài, video..."}
            className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white border border-slate-200 shadow-xs text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {category && category !== 'Tat-ca' && (
            <input type="hidden" name="category" value={category} />
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Categories Filter Pills */}
        {!isThongBao ? (
          <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
            {newsCategories.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={`/posts?category=${cat.id}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 pt-1">
            <Link
              href="/posts"
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            >
              ← Xem tất cả tin tức
            </Link>
          </div>
        )}
      </div>

      {/* Filter status summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3">
        <span>
          Đang xem:{' '}
          <strong className="text-slate-800">
            {CATEGORIES.find((c) => c.id === category)?.label || 'Tất cả bài viết'}
          </strong>
          {search && (
            <span>
              {' '}với từ khóa &ldquo;<strong className="text-blue-600">{search}</strong>&rdquo;
            </span>
          )}
        </span>
        <span>
          Tìm thấy <strong className="text-slate-800 font-tech">{posts.length}</strong> bài viết
        </span>
      </div>

      {/* Post Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy nội dung phù hợp</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rất tiếc, không có bài viết hoặc thông báo nào khớp với bộ lọc hiện tại.
          </p>
          <div>
            <Link
              href="/posts"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Xem tất cả bài viết
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
