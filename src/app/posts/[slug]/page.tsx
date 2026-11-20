import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPosts, getPostBySlug, incrementViews } from '@/lib/db';
import { CATEGORIES } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import YouTubePlayer from '@/components/YouTubePlayer';
import ImageGallery from '@/components/ImageGallery';
import PostCard from '@/components/PostCard';
import { 
  Calendar, 
  Eye, 
  User, 
  ChevronRight, 
  Share2, 
  ArrowLeft, 
  Video, 
  Clock, 
  Tag 
} from 'lucide-react';

interface PostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const runtime = 'edge';
export const revalidate = 0;

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.status !== 'published') {
    notFound();
  }

  // Tăng lượt xem (server-side call)
  incrementViews(post.id);

  const category = CATEGORIES.find((c) => c.id === post.category) || {
    id: post.category,
    label: post.category,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  };

  // Bài viết liên quan
  const allPosts = getPosts().filter((p) => p.status === 'published' && p.id !== post.id);
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category)
    .concat(allPosts.filter((p) => p.category !== post.category))
    .slice(0, 3);

  // Render nội dung (chuyển đổi đơn giản các ký tự Markdown cơ bản: ##, ###, *, >)
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-4" />;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx}>{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx}>{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('# ')) {
        return <h2 key={idx}>{trimmed.replace('# ', '')}</h2>;
      }
      if (trimmed.startsWith('> ')) {
        return <blockquote key={idx}>{trimmed.replace('> ', '')}</blockquote>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <ul key={idx}>
            <li>{trimmed.substring(2)}</li>
          </ul>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <ol key={idx}>
            <li>{trimmed.replace(/^\d+\.\s/, '')}</li>
          </ol>
        );
      }
      return <p key={idx}>{trimmed}</p>;
    });
  };

  return (
    <div className="bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/posts" className="hover:text-blue-600 transition-colors">
            Tin tức & Hoạt động
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/posts?category=${category.id}`} className="hover:text-blue-600 transition-colors">
            {category.label}
          </Link>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/posts"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách bài viết
          </Link>
        </div>

        {/* Main Post Container */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm border border-slate-200/80">
          
          {/* Post Header */}
          <header className="space-y-4 pb-8 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${category.bgColor} ${category.color}`}>
                {category.label}
              </span>
              {(post.youtubeUrl || post.youtubeId) && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                  <Video className="w-3.5 h-3.5" />
                  Có video YouTube
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              {post.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                Người đăng: <strong className="text-slate-800">{post.author}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-slate-400" />
                {post.views || 0} lượt xem
              </span>
            </div>

            {/* Excerpt Lead */}
            {post.summary && (
              <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border-l-4 border-blue-500 text-slate-700 font-medium text-sm sm:text-base leading-relaxed">
                {post.summary}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {post.thumbnail && (
            <div className="my-8 rounded-2xl overflow-hidden shadow-md">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
              <p className="text-center text-xs text-slate-400 py-2 bg-slate-50 italic">
                Ảnh hoạt động CLB STEM
              </p>
            </div>
          )}

          {/* 🎬 Embedded YouTube Video Section */}
          {(post.youtubeUrl || post.youtubeId) && (
            <div className="my-10 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <div className="w-2 h-5 bg-red-600 rounded-full" />
                <span>Video Phóng Sự / Thực Nghiệm (YouTube)</span>
              </div>
              <YouTubePlayer
                url={post.youtubeUrl}
                youtubeId={post.youtubeId}
                title={post.title}
              />
              <p className="text-xs text-slate-500 text-right">
                * Có thể bấm vào video để xem trực tiếp hoặc mở trên ứng dụng YouTube.
              </p>
            </div>
          )}

          {/* Article Body Content */}
          <div className="prose-stem text-slate-700 text-sm sm:text-base leading-relaxed my-8">
            {renderFormattedContent(post.content)}
          </div>

          {/* Image Gallery (if provided) */}
          {post.gallery && post.gallery.length > 0 && (
            <ImageGallery images={post.gallery} title="Bộ sưu tập ảnh hoạt động" />
          )}

          {/* Footer Action / Share */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>Chuyên mục: <strong>{category.label}</strong></span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-700">Chia sẻ:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.href : ''
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                Facebook
              </a>
            </div>
          </div>

        </article>

        {/* 📚 Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
              Bài Viết Liên Quan Khác
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <PostCard key={rPost.id} post={rPost} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
