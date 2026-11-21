import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ExternalLink, Bot } from 'lucide-react';

export const metadata = {
  title: 'BSSRC - Cổng Quản Trị Hệ Thống',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-blue-600 selection:text-white">
      
      {/* Header Quản Trị đồng bộ 100% màu sắc và phong cách kính mờ với trang public */}
      <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Brand Admin */}
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-12 h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Logo BSSRC"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg md:text-xl tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors font-tech">
                    BSSRC
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                    Admin Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">THPT Bắc Đông Quan — Quản Trị Hệ Thống</p>
              </div>
            </Link>

            {/* Quick Links: Public Site */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* View Public Portal */}
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition-all"
                title="Mở cổng thông tin công khai"
              >
                <span>Xem Cổng Public</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Main Admin Content Area */}
      <main className="flex-1 bg-slate-50">
        {children}
      </main>

      {/* Footer Quản Trị đồng bộ với Public */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© 2026 Khu vực Quản Trị Cổng Thông Tin BSSRC — Trường THPT Bắc Đông Quan.</p>
          <p className="text-slate-400">Phiên làm việc nội bộ an toàn • Bảo mật máy chủ</p>
        </div>
      </footer>

    </div>
  );
}
