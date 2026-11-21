'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, Phone, Mail, Search, Lock } from 'lucide-react';

export default function PortalTopBar() {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentDate(`${dayName}, ${day}/${month}/${year} | ${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const adjustFontSize = (level: 'small' | 'normal' | 'large') => {
    const root = document.documentElement;
    if (level === 'small') {
      root.style.fontSize = '14.5px';
    } else if (level === 'large') {
      root.style.fontSize = '17.5px';
    } else {
      root.style.fontSize = '16px';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/posts?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <div className="bg-slate-100/90 text-slate-600 text-[11px] md:text-xs border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-y-1">
        
        {/* Left: School Name & Realtime Clock */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="font-bold text-blue-700 tracking-wide uppercase">
            TRƯỜNG THPT BẮC ĐÔNG QUAN
          </span>
          <span className="hidden sm:inline-block text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{currentDate || 'Đang cập nhật...'}</span>
          </div>
        </div>

        {/* Right: Contact, Font size, Search, & Small Admin Login */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Hotline / Email */}
          <div className="hidden lg:flex items-center gap-3 text-slate-500">
            <a href="tel:0984552238" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>0984 552 238</span>
            </a>
            <span className="text-slate-300">|</span>
            <a href="mailto:bdq.stemlab@gmail.com" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Mail className="w-3 h-3 text-blue-600" />
              <span>bdq.stemlab@gmail.com</span>
            </a>
          </div>

          {/* Font Size Accessibility Controls */}
          <div className="flex items-center gap-1 bg-white rounded-md px-1.5 py-0.5 border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-400 mr-1 hidden sm:inline">Cỡ chữ:</span>
            <button
              onClick={() => adjustFontSize('small')}
              title="Cỡ chữ nhỏ"
              className="px-1.5 py-0.5 rounded text-[11px] hover:bg-slate-100 text-slate-600 transition-colors"
            >
              A-
            </button>
            <button
              onClick={() => adjustFontSize('normal')}
              title="Cỡ chữ mặc định"
              className="px-1.5 py-0.5 rounded text-[11px] font-bold hover:bg-slate-100 text-slate-800 transition-colors"
            >
              A
            </button>
            <button
              onClick={() => adjustFontSize('large')}
              title="Cỡ chữ lớn"
              className="px-1.5 py-0.5 rounded text-[11px] font-extrabold text-blue-600 hover:bg-slate-100 transition-colors"
            >
              A+
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tin tức, thông báo..."
                  autoFocus
                  onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                  className="bg-white text-slate-800 placeholder-slate-400 text-xs rounded-l px-2.5 py-1 border border-blue-500 focus:outline-none w-44 sm:w-52 shadow-xs"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-r border border-l-0 border-blue-600"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
                title="Tìm kiếm"
              >
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Tìm kiếm</span>
              </button>
            )}
          </div>

          {/* 🔐 Nút chức năng Đăng nhập Admin bé bé */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-slate-400 hover:text-blue-700 hover:bg-white hover:border hover:border-slate-200 transition-all"
            title="Đăng nhập quản trị viên"
          >
            <Lock className="w-3 h-3 text-slate-400 hover:text-blue-600" />
            <span>Đăng nhập</span>
          </Link>

        </div>

      </div>
    </div>
  );
}
