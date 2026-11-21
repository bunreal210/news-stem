'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';

interface BreakingNewsTickerProps {
  posts: Post[];
}

export default function BreakingNewsTicker({ posts }: BreakingNewsTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter urgent notices and latest published posts
  const urgentOrLatest = posts
    .filter((p) => p.status === 'published')
    .slice(0, 5);

  useEffect(() => {
    if (urgentOrLatest.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % urgentOrLatest.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [urgentOrLatest.length]);

  if (!urgentOrLatest || urgentOrLatest.length === 0) return null;

  const currentPost = urgentOrLatest[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? urgentOrLatest.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % urgentOrLatest.length);
  };

  return (
    <div className="bg-blue-50/70 border-b border-blue-100/80 py-2 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        
        {/* Ticker Label Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <Bell className="w-3 h-3 animate-pulse" />
            <span>Mới nhất</span>
          </span>
        </div>

        {/* Scrolling / Rotating Headline */}
        <div className="flex-1 overflow-hidden min-w-0">
          <Link
            href={`/posts/${currentPost.slug}`}
            className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors truncate block"
          >
            <span className="text-blue-700 font-bold mr-2">
              [{currentPost.category === 'Thong-bao' ? 'THÔNG BÁO' : 'TIN TỨC'}]:
            </span>
            <span>{currentPost.title}</span>
          </Link>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[11px] text-slate-400 font-medium mr-1 hidden sm:inline">
            {currentIndex + 1}/{urgentOrLatest.length}
          </span>
          <button
            onClick={handlePrev}
            className="p-1 rounded hover:bg-blue-100 text-slate-500 hover:text-blue-700 transition-colors"
            title="Tin trước"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded hover:bg-blue-100 text-slate-500 hover:text-blue-700 transition-colors"
            title="Tin sau"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
