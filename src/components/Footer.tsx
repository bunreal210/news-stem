import React from 'react';
import Link from 'next/link';
import { Cpu, Mail, Phone, MapPin, Youtube, Facebook, Heart } from 'lucide-react';
import { CATEGORIES } from '@/lib/types';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Cột 1: Thông tin CLB */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">CLB STEM TRƯỜNG</h3>
                <p className="text-xs text-blue-400 font-medium">Science • Tech • Eng • Math</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Môi trường nuôi dưỡng niềm đam mê khoa học, khơi dậy tinh thần nghiên cứu và chế tạo các giải pháp công nghệ ứng dụng trong đời sống cho học sinh.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                title="Facebook CLB"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                title="Kênh YouTube CLB"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Cột 2: Chuyên mục chính */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2">
              Chuyên mục hoạt động
            </h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.filter(c => c.id !== 'Tat-ca').map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/posts?category=${cat.id}`}
                    className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Liên kết nhanh */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-cyan-500 pl-2">
              Liên kết hữu ích
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/posts" className="hover:text-cyan-400 transition-colors">
                  Tất cả bài viết & video
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  Giới thiệu ban chủ nhiệm
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-cyan-400 transition-colors">
                  Khu vực Quản trị viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Thông tin liên hệ */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-indigo-500 pl-2">
              Liên hệ CLB
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Phòng thực hành STEM, Nhà A, Trường THPT</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>clb.stem.school@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>0912 345 678 (Thầy Phụ trách)</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bản quyền */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} CLB STEM Nhà Trường. Tất cả quyền được bảo lưu.</p>
          <p className="flex items-center gap-1">
            Phát triển với niềm tự hào Khoa học & Công nghệ <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
