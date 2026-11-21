import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPosts, getPostBySlug, incrementViews, getAnnouncements } from '@/lib/db';
import { CATEGORIES } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import YouTubePlayer from '@/components/YouTubePlayer';
import ImageGallery from '@/components/ImageGallery';
import PostCard from '@/components/PostCard';
import ArticleToolbar from '@/components/ArticleToolbar';
import { 
  Calendar, 
  Eye, 
  User, 
  ChevronRight, 
  Share2, 
  ArrowLeft, 
  Video, 
  Clock, 
  Tag, 
  FileText, 
  Download,
  Bell,
  Printer,
  ExternalLink
} from 'lucide-react';

interface PostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';
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

  // Danh sách thông báo mới nhất cho sidebar
  const sidebarNotices = getAnnouncements().slice(0, 4);

  // Render nội dung (chuyển đổi đơn giản các ký tự Markdown cơ bản: ##, ###, *, >)
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <div key={idx} className="h-4" />;
      }
      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-lg font-bold text-slate-900 mt-6 mb-2">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="text-xl font-black text-slate-900 mt-8 mb-3 pb-2 border-b border-slate-100">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('# ')) {
        return <h2 key={idx} className="text-2xl font-black text-slate-900 mt-8 mb-4">{trimmed.replace('# ', '')}</h2>;
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="p-4 my-4 border-l-4 border-blue-500 bg-blue-50/50 rounded-r-xl italic text-slate-700 text-sm">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <ul key={idx} className="list-disc pl-5 my-1 text-slate-700">
            <li>{trimmed.substring(2)}</li>
          </ul>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <ol key={idx} className="list-decimal pl-5 my-1 text-slate-700">
            <li>{trimmed.replace(/^\d+\.\s/, '')}</li>
          </ol>
        );
      }
      return <p key={idx} className="my-2.5 text-slate-700 leading-relaxed">{trimmed}</p>;
    });
  };

  return (
    <div className="bg-slate-50/60 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 print:hidden">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/posts" className="hover:text-blue-600 transition-colors">
            Kho tin tức
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/posts?category=${category.id}`} className="hover:text-blue-600 transition-colors">
            {category.label}
          </Link>
        </nav>

        {/* Grid 2 cột: Cột bài viết (8 cols) & Cột thông báo/tin nhanh (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT CHÍNH: BÀI BÁO / BẢN TIN CHI TIẾT */}
          <main className="lg:col-span-8">
            <article className="bg-white rounded-2xl p-6 sm:p-10 shadow-xs border border-slate-200">
              
              {/* Header bài viết */}
              <header className="space-y-4 pb-6 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${category.bgColor} ${category.color}`}>
                    {category.label}
                  </span>
                  {post.isUrgent && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-red-100 text-red-700">
                      Thông báo khẩn
                    </span>
                  )}
                  {(post.youtubeUrl || post.youtubeId) && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                      <Video className="w-3.5 h-3.5" />
                      Video phóng sự
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                  {post.title}
                </h1>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    Đăng bởi: <strong className="text-slate-800">{post.author}</strong>
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

                {/* Thanh tiện ích: In bài, Cỡ chữ, Sao chép link */}
                <ArticleToolbar title={post.title} />

                {/* Excerpt Lead / Sapo chuẩn báo chí */}
                {post.summary && (
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border-l-4 border-blue-600 text-slate-700 font-semibold text-sm sm:text-base leading-relaxed italic">
                    {post.summary}
                  </div>
                )}
              </header>

              {/* Ảnh đại diện bài viết */}
              {post.thumbnail && (
                <div className="my-6 rounded-xl overflow-hidden border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                  <p className="text-center text-xs text-slate-500 py-2 bg-slate-50 italic">
                    Ảnh tư liệu: {post.title}
                  </p>
                </div>
              )}

              {/* 🎬 Embedded YouTube Video Section */}
              {(post.youtubeUrl || post.youtubeId) && (
                <div className="my-8 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <div className="w-2 h-5 bg-red-600 rounded-full" />
                    <span>Video Phóng Sự / Thực Nghiệm Thực Tế</span>
                  </div>
                  <YouTubePlayer
                    url={post.youtubeUrl}
                    youtubeId={post.youtubeId}
                    title={post.title}
                  />
                </div>
              )}

              {/* Article Body Content */}
              <div id="article-content-body" className="prose-stem text-slate-800 text-sm sm:text-base leading-relaxed my-6">
                {renderFormattedContent(post.content)}
              </div>

              {/* 📥 TÀI LIỆU ĐÍNH KÈM / BIỂU MẪU TẢI VỀ */}
              {post.attachments && post.attachments.length > 0 && (
                <div className="my-8 p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
                    <FileText className="w-4 h-4 text-blue-700" />
                    <span>Tài Liệu Đính Kèm / Biểu Mẫu Tải Về</span>
                  </div>
                  <div className="divide-y divide-blue-100">
                    {post.attachments.map((att, i) => (
                      <div key={i} className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200 text-blue-800">
                            {att.type || 'FILE'}
                          </span>
                          <span className="text-xs font-semibold text-slate-800 truncate">
                            {att.name}
                          </span>
                          {att.size && (
                            <span className="text-[11px] text-slate-500 shrink-0">
                              ({att.size})
                            </span>
                          )}
                        </div>
                        <a
                          href={att.url}
                          className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải về</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Gallery (if provided) */}
              {post.gallery && post.gallery.length > 0 && (
                <ImageGallery images={post.gallery} title="Bộ sưu tập ảnh hoạt động" />
              )}

              {/* Footer bài viết: Phân loại & Chia sẻ */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 print:hidden">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span>Chuyên mục: <strong>{category.label}</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">Chia sẻ bài viết:</span>
                  <a
                    href="https://facebook.com/bdq.ssrc"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Fanpage BSSRC
                  </a>
                </div>
              </div>

            </article>

            {/* Back Button */}
            <div className="mt-6 print:hidden">
              <Link
                href="/posts"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại kho tin tức cổng thông tin</span>
              </Link>
            </div>
          </main>

          {/* CỘT PHỤ (4 cols): THÔNG BÁO MỚI & BÀI CÙNG CHUYÊN MỤC */}
          <aside className="lg:col-span-4 space-y-6 print:hidden">
            
            {/* Hộp Thông Báo Mới */}
            <div className="bg-white rounded-2xl border border-red-200 p-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-red-100 pb-2 mb-3">
                <Bell className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wide">
                  Thông Báo Mới Cập Nhật
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {sidebarNotices.map((tb) => (
                  <div key={tb.id} className="py-2.5 first:pt-0 last:pb-0">
                    <span className="text-[10px] text-slate-400 block mb-0.5">
                      {formatDate(tb.createdAt)}
                    </span>
                    <Link
                      href={`/posts/${tb.slug}`}
                      className="text-xs font-bold text-slate-800 hover:text-red-700 transition-colors line-clamp-2 leading-snug"
                    >
                      {tb.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Hộp Bài Viết Cùng Chuyên Mục */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wide">
                    Tin Cùng Chuyên Mục
                  </h3>
                </div>
                <div className="space-y-3">
                  {relatedPosts.map((rPost) => (
                    <div key={rPost.id} className="flex items-start gap-3 group">
                      <div className="w-18 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rPost.thumbnail}
                          alt={rPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/posts/${rPost.slug}`}
                          className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug"
                        >
                          {rPost.title}
                        </Link>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {formatDate(rPost.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Banner Hệ thống quản lý phòng lab */}
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4.5 text-center shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block">
                Nền tảng số
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1">
                Hệ thống quản lý phòng lab
              </h4>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Đăng ký mượn linh kiện & đặt lịch nghiên cứu tại pttp.id.vn
              </p>
              <a
                href="https://pttp.id.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <span>Truy cập pttp.id.vn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
