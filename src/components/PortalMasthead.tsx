'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

export default function PortalMasthead() {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="bg-white border-b border-slate-200 py-3.5 sm:py-5 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Official Portal Heading */}
          <Link href="/" className="flex items-center gap-3.5 sm:gap-4 group text-center md:text-left">
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0 p-1 group-hover:scale-105 transition-transform">
              {!logoError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/logo.png"
                  alt="Logo CLB STEM BSSRC"
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl">
                  B
                </div>
              )}
            </div>

            <div>
              <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase">
                TRƯỜNG THPT BẮC ĐÔNG QUAN
              </p>
              <h1 className="text-lg sm:text-2xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-700 transition-colors">
                CỔNG THÔNG TIN ĐIỆN TỬ STEM & ROBOTICS
              </h1>
              <p className="text-xs sm:text-xs text-blue-700 font-semibold flex items-center gap-2 justify-center md:justify-start mt-0.5">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">BSSRC</span>
                <span>Khơi nguồn sáng tạo — Chinh phục đam mê</span>
              </p>
            </div>
          </Link>

          {/* Right Action Banners: PTTP System & Official Social */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center">
            
            {/* pttp.id.vn badge button */}
            <a
              href="https://pttp.id.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-all shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Hệ thống số Lab
                </span>
                <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                  pttp.id.vn
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                </span>
              </div>
            </a>

            {/* Official Fanpage */}
            <a
              href="https://facebook.com/bdq.ssrc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all shadow-blue-500/20"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
              </svg>
              <span>Fanpage BSSRC</span>
            </a>

          </div>

        </div>
      </div>
    </div>
  );
}
