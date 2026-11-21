import React from 'react';
import Link from 'next/link';
import { 
  getPosts, 
  getSiteConfig, 
  getAnnouncements, 
  getDocumentResources 
} from '@/lib/db';
import BreakingNewsTicker from '@/components/BreakingNewsTicker';
import YouTubePlayer from '@/components/YouTubePlayer';
import { formatDate } from '@/lib/utils';
import { 
  ArrowRight, 
  Bell, 
  Calendar, 
  Clock, 
  FileText, 
  Download, 
  ExternalLink, 
  Eye, 
  ShieldCheck, 
  Video, 
  MapPin, 
  ChevronRight,
  Newspaper,
  Users
} from 'lucide-react';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0; // dynamic on request

export default async function HomePage() {
  const allPosts = (await getPosts()).filter((p) => p.status === 'published');
  const announcements = await getAnnouncements();
  const documents = await getDocumentResources();
  const config = getSiteConfig();

  // Tin tức (bài viết không phải là thông báo thuần túy)
  const newsPosts = allPosts.filter((p) => p.category !== 'Thong-bao');

  // Bài tiêu điểm chính (Lead Story)
  const leadPost = newsPosts.find((p) => p.featured) || newsPosts[0];
  
  // 3 Bài tiêu điểm phụ
  const subFeaturedPosts = newsPosts
    .filter((p) => p.id !== leadPost?.id)
    .slice(0, 3);

  // Các bài viết tin tức còn lại
  const remainingNewsPosts = newsPosts.filter(
    (p) => p.id !== leadPost?.id && !subFeaturedPosts.some((sp) => sp.id === p.id)
  );

  // Bài có video để đưa vào Video Spotlight
  const videoPost = allPosts.find((p) => p.youtubeUrl || p.youtubeId);

  return (
    <div className="space-y-8 sm:space-y-10 pb-16">
      
      {/* 1. DÒNG TIN MỚI CẬP NHẬT (BREAKING NEWS TICKER) */}
      <BreakingNewsTicker posts={allPosts} />

      {/* 2. CỤM TIÊU ĐIỂM TIN TỨC & BẢNG THÔNG BÁO (FOLD 1 - 70/30) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CỘT CHÍNH (70% - 8 cols): CỤM TIN TIÊU ĐIỂM */}
          <section className="lg:col-span-8 space-y-6">
            
            {/* Header dải tiêu điểm */}
            <div className="flex items-center justify-between border-b-2 border-blue-600 pb-2">
              <div className="flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-600" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
                  Tin Tức Tiêu Điểm
                </h2>
              </div>
              <Link
                href="/posts"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                <span>Xem tất cả tin tức</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Bài viết chính nổi bật nhất (Lead Story) */}
            {leadPost ? (
              <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                  <div className="md:col-span-7 relative overflow-hidden aspect-[16/10] md:aspect-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={leadPost.thumbnail}
                      alt={leadPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase shadow-sm">
                      Tiêu điểm
                    </span>
                  </div>

                  <div className="md:col-span-5 p-5 sm:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{formatDate(leadPost.createdAt)}</span>
                        <span>•</span>
                        <span className="text-blue-600 font-semibold">{leadPost.author}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-3">
                        <Link href={`/posts/${leadPost.slug}`}>
                          {leadPost.title}
                        </Link>
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mt-2.5 leading-relaxed">
                        {leadPost.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {leadPost.views} lượt đọc
                      </span>
                      <Link
                        href={`/posts/${leadPost.slug}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Chi tiết</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center text-slate-400 text-xs sm:text-sm">
                Chưa có bài viết tin tức nào trên hệ thống.
              </div>
            )}

            {/* 3 Bài tiêu điểm phụ (Sub-featured 3 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {subFeaturedPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-2xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3.5">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        <Link href={`/posts/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h4>
                    </div>
                  </div>

                  <div className="px-3.5 pb-3 pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-50">
                    <span className="truncate max-w-[65%]">{post.author}</span>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Đọc tiếp
                    </Link>
                  </div>
                </article>
              ))}
            </div>

          </section>

          {/* CỘT PHỤ (30% - 4 cols): BẢNG THÔNG BÁO & TIỆN ÍCH */}
          <aside className="lg:col-span-4 space-y-5">
            
            {/* HỘP 1: BẢNG THÔNG BÁO (GIỮ RIÊNG BIỆT) */}
            <div className="bg-white rounded-2xl border border-red-200/90 shadow-xs overflow-hidden">
              <div className="bg-red-50/90 border-b border-red-100 text-red-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-600 animate-pulse" />
                  <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide text-red-900">
                    Bảng Thông Báo
                  </h3>
                </div>
                <Link
                  href="/posts?category=Thong-bao"
                  className="text-[11px] text-red-600 hover:text-red-800 font-bold hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>

              <div className="p-3 divide-y divide-slate-100">
                {announcements.length > 0 ? (
                  announcements.map((tb) => {
                    const dateObj = new Date(tb.createdAt);
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = `T${dateObj.getMonth() + 1}`;

                    return (
                      <article key={tb.id} className="py-2.5 first:pt-1 last:pb-1 flex items-start gap-3 group">
                        {/* Date Badge */}
                        <div className="shrink-0 w-11 text-center rounded-lg bg-red-50 border border-red-200 overflow-hidden">
                          <span className="block bg-red-600 text-white text-[10px] font-bold py-0.5 leading-none">
                            {month}
                          </span>
                          <span className="block text-sm font-black text-slate-800 py-1 leading-none font-tech">
                            {day}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {tb.isUrgent && (
                            <span className="inline-block bg-red-100 text-red-700 text-[9px] font-extrabold px-1.5 py-0.2 rounded mr-1.5 uppercase">
                              Khẩn
                            </span>
                          )}
                          <Link
                            href={`/posts/${tb.slug}`}
                            className="text-xs font-bold text-slate-800 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug"
                          >
                            {tb.title}
                          </Link>
                          {tb.attachments && tb.attachments.length > 0 && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                              <FileText className="w-3 h-3 text-red-500" />
                              <span>Kèm {tb.attachments.length} tài liệu tải về</span>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    Chưa có thông báo nào từ ban quản trị.
                  </div>
                )}
              </div>
            </div>

            {/* HỘP 2: KHO VĂN BẢN & BIỂU MẪU TẢI VỀ */}
            <div className="bg-white rounded-2xl border border-blue-200/90 shadow-xs p-4.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide text-slate-900">
                    Kho Văn Bản & Biểu Mẫu
                  </h3>
                </div>
                <Link
                  href="/documents"
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-bold hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tải các mẫu phiếu thuyết minh đề tài KHKT, kế hoạch hoạt động và giáo trình chế tạo STEM.
              </p>
              <Link
                href="/documents"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tra cứu & Tải văn bản ({documents.length})</span>
              </Link>
            </div>

            {/* HỘP 3: HỆ THỐNG QUẢN LÝ PHÒNG LAB (PTTP.ID.VN) */}
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4.5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Nền tảng số
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Hệ thống quản lý phòng lab
              </h4>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Đăng ký mượn phòng thực hành STEM, kiểm kê linh kiện điện tử và trao đổi học thuật tại <span className="font-semibold text-emerald-700">pttp.id.vn</span>.
              </p>
              <a
                href="https://pttp.id.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <span>Truy cập Hệ thống quản lý phòng lab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </aside>

        </div>
      </div>

      {/* 3. DÒNG TIN TỨC MỚI CẬP NHẬT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-6">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-blue-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight">
                Tin Tức & Hoạt Động Mới Nhất
              </h2>
            </div>
            <Link
              href="/posts"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Xem tất cả ({newsPosts.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {remainingNewsPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingNewsPosts.slice(0, 6).map((post) => (
                <article key={post.id} className="group flex flex-col justify-between rounded-xl border border-slate-100 hover:border-blue-200 p-3 transition-colors bg-slate-50/40">
                  <div>
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3 border border-slate-200/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{formatDate(post.createdAt)}</span>
                      <span>•</span>
                      <span className="text-slate-600">{post.author}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/posts/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">{post.views} lượt xem</span>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Xem tiếp</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-slate-400 text-xs bg-slate-50/60 rounded-2xl border border-slate-200/60">
              Chưa có thêm tin tức hoặc bài viết nào khác.
            </div>
          )}

        </div>
      </section>

      {/* 4. VĂN BẢN, BIỂU MẪU & TÀI LIỆU TẢI VỀ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                Văn Bản, Biểu Mẫu & Tài Liệu Nghiên Cứu Tải Về
              </h3>
            </div>
            <Link
              href="/documents"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Xem toàn bộ văn bản ({documents.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th className="py-2.5 px-3 font-bold w-12 text-center">STT</th>
                  <th className="py-2.5 px-3 font-bold">Tên Văn bản / Biểu mẫu</th>
                  <th className="py-2.5 px-3 font-bold hidden sm:table-cell">Số hiệu</th>
                  <th className="py-2.5 px-3 font-bold hidden md:table-cell">Phân loại</th>
                  <th className="py-2.5 px-3 font-bold hidden sm:table-cell">Ngày ban hành</th>
                  <th className="py-2.5 px-3 font-bold text-center w-28">Tải về</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.length > 0 ? (
                  documents.map((doc, idx) => (
                    <tr key={doc.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-semibold">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        <span>{doc.title}</span>
                        <span className="sm:hidden block text-[10px] text-slate-400 mt-0.5">
                          {doc.code} • {doc.publishDate}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 hidden sm:table-cell">{doc.code}</td>
                      <td className="py-2.5 px-3 hidden md:table-cell">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 hidden sm:table-cell">{doc.publishDate}</td>
                      <td className="py-2.5 px-3 text-center">
                        <a
                          href={doc.downloadUrl}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 transition-colors"
                          title={`Tải file ${doc.fileType} (${doc.fileSize})`}
                        >
                          <Download className="w-3 h-3" />
                          <span>{doc.fileType} ({doc.fileSize})</span>
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      Chưa có văn bản hoặc tài liệu nào được ban hành.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 5. GÓC ĐA PHƯƠNG TIỆN - VIDEO SPOTLIGHT */}
      {videoPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                  Đa Phương Tiện — Video Hoạt Động Thực Nghiệm
                </h3>
              </div>
              <span className="text-xs text-slate-500 hidden sm:inline">Kênh YouTube BDQ STEM Lab</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-3">
                <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full inline-block">
                  Phóng sự thực tế
                </span>
                <h4 className="text-lg font-bold text-slate-900 leading-snug">
                  {videoPost.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {videoPost.summary}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/posts/${videoPost.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <span>Xem toàn văn bài viết & thảo luận</span>
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

      {/* 6. BỘ ĐẾM TRUY CẬP CỔNG THÔNG TIN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 shadow-2xs">
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Đang trực tuyến: <strong className="text-slate-900 font-tech">18</strong></span>
            </span>
            <span>Tổng lượt truy cập: <strong className="text-slate-900 font-tech">12,480</strong></span>
            <span>Tổng số tin bài & thông báo: <strong className="text-slate-900 font-tech">{allPosts.length}</strong></span>
          </div>

          <div className="text-[11px] text-slate-400">
            Cổng Thông Tin BSSRC — THPT Bắc Đông Quan
          </div>
        </div>
      </section>

    </div>
  );
}
