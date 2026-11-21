'use client';

import React, { useState } from 'react';
import { Printer, Share2, ZoomIn, ZoomOut, Check, Copy } from 'lucide-react';

interface ArticleToolbarProps {
  title: string;
}

export default function ArticleToolbar({ title }: ArticleToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const adjustText = (delta: number) => {
    const articleBody = document.getElementById('article-content-body');
    if (articleBody) {
      const currentSize = parseFloat(window.getComputedStyle(articleBody).fontSize);
      const newSize = Math.max(14, Math.min(24, currentSize + delta));
      articleBody.style.fontSize = `${newSize}px`;
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap py-2 border-y border-slate-100 my-4 text-xs text-slate-600 print:hidden">
      <span className="font-semibold text-slate-500 mr-1">Tiện ích:</span>
      
      {/* Cỡ chữ */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200">
        <button
          onClick={() => adjustText(-1)}
          className="px-2 py-0.5 rounded hover:bg-white text-slate-700 font-bold transition-colors"
          title="Thu nhỏ chữ"
        >
          A-
        </button>
        <button
          onClick={() => adjustText(1)}
          className="px-2 py-0.5 rounded hover:bg-white text-blue-700 font-bold transition-colors"
          title="Phóng to chữ"
        >
          A+
        </button>
      </div>

      {/* In bài viết */}
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
        title="In bài viết hoặc lưu PDF"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>In bài viết</span>
      </button>

      {/* Sao chép liên kết */}
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
        title="Sao chép liên kết"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">Đã chép link</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Sao chép link</span>
          </>
        )}
      </button>
    </div>
  );
}
