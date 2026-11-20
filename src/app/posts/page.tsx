import React from 'react';
import { getPosts } from '@/lib/db';
import PostCard from '@/components/PostCard';
import { CATEGORIES } from '@/lib/types';
import Link from 'next/link';
import { Search, FolderOpen, Layers, Newspaper } from 'lucide-react';

interface PostsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export const runtime = 'edge';
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

  const activeCategory = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Newspaper className="w-3.5 h-3.5" />
          Bản tin hoạt động CLB
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Tin Tức & Hoạt Động STEM
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Tổng hợp tất cả các sự kiện, nghiên cứu chế tạo, tập huấn kỹ năng và giải thưởng của các thành viên CLB STEM.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <form method="GET" action="/posts" className="max-w-xl mx-auto relative">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Tìm kiếm bài viết, video, dự án..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {category && category !== 'Tat-ca' && (
            <input type="hidden" name="category" value={category} />
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Categories Tab Bar */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <Link
                key={cat.id}
                href={`/posts?category=${cat.id}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filter status summary */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 border-b border-slate-200 pb-4">
        <span>
          Đang hiển thị: <strong className="text-slate-800">{activeCategory.label}</strong>
          {search && (
            <span>
              {' '}với từ khóa &ldquo;<strong className="text-blue-600">{search}</strong>&rdquo;
            </span>
          )}
        </span>
        <span>
          Tìm thấy <strong className="text-slate-800">{posts.length}</strong> bài viết
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
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Không tìm thấy bài viết nào</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Rất tiếc, không có bài viết nào phù hợp với bộ lọc hiện tại. Bạn vui lòng thử chọn chuyên mục khác hoặc từ khóa khác nhé.
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
