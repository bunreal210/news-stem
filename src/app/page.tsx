import React from 'react';
import Link from 'next/link';
import { getPosts, getSiteConfig } from '@/lib/db';
import PostCard from '@/components/PostCard';
import YouTubePlayer from '@/components/YouTubePlayer';
import { CATEGORIES } from '@/lib/types';
import { 
  Sparkles, 
  ArrowRight, 
  Trophy, 
  Cpu, 
  Lightbulb, 
  Users, 
  Video, 
  Flame,
  Atom,
  Binary,
  Layers,
  Wrench
} from 'lucide-react';

export const runtime = 'edge';
export const revalidate = 0; // dynamic on request

export default async function HomePage() {
  const allPosts = getPosts().filter((p) => p.status === 'published');
  const config = getSiteConfig();

  // Bài nổi bật
  const featuredPost = allPosts.find((p) => p.featured) || allPosts[0];
  // Các bài viết khác
  const remainingPosts = allPosts.filter((p) => p.id !== featuredPost?.id);
  // Bài có video để đưa vào Video Spotlight
  const videoPost = allPosts.find((p) => p.youtubeUrl || p.youtubeId);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 🚀 HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Tech Grid background glow */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/20 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-blue-500/10 border border-blue-400/30 text-blue-300 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Cổng Thông Tin Hoạt Động & Nghiên Cứu STEM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Khơi Nguồn Đam Mê <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Chinh Phục Công Nghệ Tương Lai
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-300 leading-relaxed font-light">
            Không gian học tập trải nghiệm, nghiên cứu Robotics, IoT, In 3D và các đề tài sáng tạo khoa học kỹ thuật của học sinh nhà trường.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Xem Tin Tức & Hoạt Động
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/10 backdrop-blur-sm transition-all"
            >
              Đăng Bài Viết (Admin)
            </Link>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto border-t border-white/10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">50+</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Thành viên năng nổ</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-blue-400">20+</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Dự án & Sáng chế</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Thực hành thực tế</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">12+</div>
              <div className="text-xs text-slate-300 mt-1 font-medium">Hội thi & Giải thưởng</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 4 TRỤ CỘT S.T.E.M */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
              <Atom className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Science (Khoa học)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Khám phá quy luật tự nhiên, các thí nghiệm Vật lý, Hóa học và Sinh học ứng dụng.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-cyan-50/60 border border-cyan-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center mb-4">
              <Binary className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Technology (Công nghệ)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lập trình phần mềm, hệ thống cảm biến IoT, Trí tuệ nhân tạo (AI) và vi mạch.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Engineering (Kỹ thuật)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thiết kế mô hình 3D CAD, gia công in 3D và lắp ráp cơ cấu cơ khí cánh tay robot.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-purple-50/60 border border-purple-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Math (Toán học)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tư duy thuật toán, tối ưu thông số, xử lý dữ liệu đo lường và thống kê thực nghiệm.
            </p>
          </div>
        </div>
      </section>

      {/* 🏆 BÀI VIẾT NỔI BẬT (FEATURED POST) */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-rose-600" />
                Tiêu điểm nổi bật
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Hoạt Động Trọng Tâm Của CLB
              </h2>
            </div>
            <Link
              href="/posts"
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Xem tất cả bài viết
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <PostCard post={featuredPost} featured={true} />
        </section>
      )}

      {/* 🎬 VIDEO SPOTLIGHT (XEM VIDEO YOUTUBE HOẠT ĐỘNG) */}
      {videoPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                  <Video className="w-3.5 h-3.5" />
                  Video Hoạt Động Thực Tế
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white leading-snug">
                  {videoPost.title}
                </h3>
                <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                  {videoPost.summary}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/posts/${videoPost.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    Xem chi tiết bài viết & thảo luận
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <YouTubePlayer
                  url={videoPost.youtubeUrl}
                  youtubeId={videoPost.youtubeId}
                  title={videoPost.title}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 📰 CÁC HOẠT ĐỘNG MỚI NHẤT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-blue-600 font-bold text-xs uppercase tracking-wider">
              Cập nhật liên tục
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Tin Tức & Hoạt Động Mới Nhất
            </h2>
          </div>

          {/* Danh mục lướt nhanh */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                href={`/posts?category=${cat.id}`}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {remainingPosts.slice(0, 6).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:border-blue-500 hover:text-blue-600 hover:shadow-lg transition-all"
          >
            Xem tất cả bài viết ({allPosts.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 🚀 BANNER ĐĂNG KÝ THAM GIA CLB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md">
              Tuyển thành viên đợt 2 - Năm học 2026
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Bạn Đam Mê Sáng Tạo & Lập Trình?
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed font-light">
              Hãy trở thành một mảnh ghép của CLB STEM để cùng nhau thiết kế những cỗ máy thông minh, tham gia các cuộc thi KHKT toàn quốc và viết nên thanh xuân rực rỡ!
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              href="/about#contact"
              className="px-6 py-3.5 rounded-2xl bg-white text-blue-800 font-bold text-sm shadow-lg hover:bg-blue-50 transition-colors text-center"
            >
              Đăng ký tham gia ngay
            </Link>
            <Link
              href="/posts"
              className="px-6 py-3.5 rounded-2xl bg-blue-800/60 hover:bg-blue-800 text-white font-bold text-sm border border-white/20 transition-colors text-center"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
