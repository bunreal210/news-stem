'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, ArrowUp, ExternalLink } from 'lucide-react';

export default function Footer() {
  const [logoError, setLogoError] = useState(false);
  const pathname = usePathname();

  // Khi đang ở các trang quản trị (/admin, /admin/*), ẩn hoàn toàn Footer public
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          {/* Logo & School Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              {!logoError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/logo.png"
                  alt="Logo BSSRC"
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <Bot className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 font-tech">BSSRC - THPT Bắc Đông Quan</h4>
              <p className="text-xs text-slate-500">CLB Nghiên cứu khoa học, STEM và Robotics</p>
            </div>
          </div>

          {/* Copyright & Thông tin Tác giả */}
          <div className="flex flex-col items-center md:items-start gap-1 text-xs text-slate-500">
            <p>© 2026 BSSRC - Trường THPT Bắc Đông Quan. Mọi quyền được bảo lưu.</p>
            <p className="flex items-center gap-1.5 text-slate-600">
              <span>Tác giả:</span>
              <a
                href="https://facebook.com/bunreal210"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors hover:underline"
              >
                <svg className="w-3.5 h-3.5 text-[#1877F2] fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                </svg>
                <span>Phạm Công Vinh</span>
              </a>
            </p>
          </div>

          {/* Hệ thống quản lý phòng lab, Fanpage & Lên đầu trang */}
          <div className="flex items-center gap-4 text-xs font-medium flex-wrap justify-center">
            <a
              href="https://pttp.id.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-600 font-medium transition-colors"
            >
              <span>Hệ thống quản lý phòng lab</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <span className="text-slate-300">•</span>

            <a
              href="https://www.facebook.com/bdq.ssrc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              <svg className="w-4 h-4 text-[#1877F2] fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
              </svg>
              <span>Fanpage CLB</span>
            </a>

            <span className="text-slate-300">•</span>

            <button
              onClick={scrollToTop}
              className="text-slate-600 hover:text-blue-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Lên đầu trang</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
