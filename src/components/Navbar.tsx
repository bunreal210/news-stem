'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Bot, Menu, X, ExternalLink, Newspaper, Bell, Home, FileText, Lock } from 'lucide-react';

function NavbarContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Khi đang ở các trang quản trị (/admin, /admin/*), ẩn hoàn toàn Navbar public
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const categoryParam = searchParams?.get('category');
  const isHomeActive = pathname === '/';
  const isThongBaoActive = pathname === '/posts' && categoryParam === 'Thong-bao';
  const isTinTucActive = (pathname === '/posts' || pathname?.startsWith('/posts/')) && !isThongBaoActive;
  const isVanBanActive = pathname === '/documents';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        
        {/* Logo & School Name (Phong cách chuẩn của bdq-ssrc.pcv-vinhbun.workers.dev) */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {!logoError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/logo.png"
                alt="Logo BSSRC"
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Bot className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg md:text-xl tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors font-tech">
                BSSRC
              </span>
              <span className="text-[11px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                CLB
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">THPT Bắc Đông Quan</p>
          </div>
        </Link>

        {/* Desktop Navigation: Home, Tin tức, Thông báo, Văn bản */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6 text-sm font-semibold text-slate-600">
          
          {/* Tab Home (Tổng hợp tin tức, thông báo...) */}
          <Link
            href="/"
            className={`transition-colors py-1.5 px-3 rounded-lg flex items-center gap-1.5 ${
              isHomeActive
                ? 'text-blue-700 font-bold bg-blue-50/80 border border-blue-200/60'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4 text-blue-600" />
            <span>Home</span>
          </Link>

          {/* Tab Tin tức (Tổng hợp toàn bộ các bài viết) */}
          <Link
            href="/posts"
            className={`transition-colors py-1.5 px-3 rounded-lg flex items-center gap-1.5 ${
              isTinTucActive
                ? 'text-blue-700 font-bold bg-blue-50/80 border border-blue-200/60'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Newspaper className="w-4 h-4 text-blue-600" />
            <span>Tin tức</span>
          </Link>

          {/* Tab Thông báo (Giữ riêng biệt) */}
          <Link
            href="/posts?category=Thong-bao"
            className={`transition-colors py-1.5 px-3 rounded-lg flex items-center gap-1.5 ${
              isThongBaoActive
                ? 'text-red-700 font-bold bg-red-50 border border-red-200'
                : 'hover:text-red-600 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-4 h-4 text-red-600" />
            <span>Thông báo</span>
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              Mới
            </span>
          </Link>

          {/* Tab Văn bản (Tải về các văn bản từ hệ thống) */}
          <Link
            href="/documents"
            className={`transition-colors py-1.5 px-3 rounded-lg flex items-center gap-1.5 ${
              isVanBanActive
                ? 'text-blue-700 font-bold bg-blue-50/80 border border-blue-200/60'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Văn bản</span>
          </Link>

        </div>

        {/* Right Action buttons: Hệ thống quản lý phòng lab & Fanpage */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Hệ thống quản lý phòng lab */}
          <a
            href="https://pttp.id.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Hệ thống quản lý phòng lab</span>
          </a>

          {/* Fanpage BSSRC */}
          <a
            href="https://facebook.com/bdq.ssrc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition-all"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
            </svg>
            <span>Fanpage CLB</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              isHomeActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4 text-blue-600" />
            <span>Home</span>
          </Link>

          <Link
            href="/posts"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              isTinTucActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Newspaper className="w-4 h-4 text-blue-600" />
            <span>Tin tức</span>
          </Link>

          <Link
            href="/posts?category=Thong-bao"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold ${
              isThongBaoActive ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-600" />
              <span>Thông báo</span>
            </div>
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Mới
            </span>
          </Link>

          <Link
            href="/documents"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold ${
              isVanBanActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Văn bản</span>
          </Link>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <a
              href="https://pttp.id.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
            >
              <ExternalLink className="w-4 h-4 text-emerald-600" />
              <span>Hệ thống quản lý phòng lab (pttp.id.vn)</span>
            </a>

            <a
              href="https://facebook.com/bdq.ssrc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              <span>Fanpage CLB BSSRC</span>
            </a>

            <div className="pt-2 text-center">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-600"
              >
                <Lock className="w-3 h-3" />
                <span>Đăng nhập Admin</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      <Suspense fallback={<div className="h-20 max-w-7xl mx-auto px-4" />}>
        <NavbarContent />
      </Suspense>
    </nav>
  );
}
