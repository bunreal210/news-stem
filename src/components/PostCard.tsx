import React from 'react';
import Link from 'next/link';
import { Post, CATEGORIES } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Calendar, Eye, PlayCircle, ArrowRight } from 'lucide-react';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const cat = CATEGORIES.find((c) => c.id === post.category) || {
    id: post.category,
    label: post.category,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  };

  const hasVideo = Boolean(post.youtubeUrl || post.youtubeId);

  if (featured) {
    return (
      <div className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
        <div className="relative lg:col-span-7 overflow-hidden aspect-[16/10] lg:aspect-auto">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent lg:hidden" />
          
          {/* Badge danh mục */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${cat.bgColor} ${cat.color}`}>
              {cat.label}
            </span>
            {hasVideo && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600 text-white shadow-sm">
                <PlayCircle className="w-3.5 h-3.5" />
                Video
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="hidden lg:flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${cat.bgColor} ${cat.color}`}>
                {cat.label}
              </span>
              {hasVideo && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                  <PlayCircle className="w-3.5 h-3.5" />
                  Có video
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {post.views || 0} lượt xem
              </span>
            </div>

            <Link href={`/posts/${post.slug}`}>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 sm:line-clamp-3">
                {post.title}
              </h3>
            </Link>

            <p className="mt-3 text-sm text-slate-600 line-clamp-3 leading-relaxed">
              {post.summary}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Tác giả: <span className="text-slate-700 font-semibold">{post.author}</span>
            </span>
            <Link
              href={`/posts/${post.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform"
            >
              Xem chi tiết
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm ${cat.bgColor} ${cat.color}`}>
            {cat.label}
          </span>
        </div>

        {hasVideo && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-600/90 text-white shadow-md backdrop-blur-sm">
            <PlayCircle className="w-3.5 h-3.5" />
            Video
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {post.views || 0}
            </span>
          </div>

          <Link href={`/posts/${post.slug}`}>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {post.summary}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 truncate max-w-[60%]">
            Bởi <span className="text-slate-700 font-medium">{post.author}</span>
          </span>
          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
          >
            Đọc tiếp
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
