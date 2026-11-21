'use client';

import React from 'react';
import { 
  Sparkles, 
  Target, 
  Award, 
  Calendar, 
  Mail, 
  MapPin, 
  CheckCircle2,
  Cpu,
  Layers,
  Wrench,
  ExternalLink
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Giới thiệu Câu Lạc Bộ
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-tech">
          BSSRC - THPT Bắc Đông Quan
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
          CLB Nghiên cứu khoa học, STEM và Robotics trường THPT Bắc Đông Quan — Nơi hội tụ những học sinh đam mê khám phá thế giới tự nhiên, yêu thích lập trình công nghệ và mong muốn áp dụng tri thức vào giải quyết các bài toán thực tiễn.
        </p>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 blur-3xl pointer-events-none rounded-full" />
          <Target className="w-10 h-10 text-cyan-400 mb-4" />
          <h2 className="text-2xl font-bold mb-3 font-tech">Tầm Nhìn & Sứ Mệnh</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Trở thành cái nôi ươm mầm các tài năng trẻ về khoa học kỹ thuật của nhà trường. Tạo dựng môi trường học thuật chuyên nghiệp, thân thiện, nơi mỗi thành viên đều có thể tự tin biến ý tưởng thành sản phẩm mẫu (prototype).
          </p>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Phổ cập giáo dục STEM đa lĩnh vực tới toàn thể học sinh.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Tham gia và đạt giải cao tại các cuộc thi Sáng chế KHKT các cấp.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Rèn luyện kỹ năng làm việc nhóm, tư duy phản biện và thuyết trình.</span>
            </li>
          </ul>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-md flex flex-col justify-between glass-card">
          <div>
            <Award className="w-10 h-10 text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3 font-tech">Thành Tích Tiêu Biểu</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Trong các năm học qua, CLB BSSRC đã ghi dấu ấn với nhiều giải thưởng cấp Tỉnh và các sân chơi khoa học kỹ thuật trong lĩnh vực Tự động hóa, Vi điều khiển và Dự án ứng dụng.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/60">
                <span className="text-2xl font-black text-amber-700 font-tech">12+</span>
                <p className="text-xs font-semibold text-amber-900 mt-1">Giải thưởng KHKT các cấp</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/60">
                <span className="text-2xl font-black text-blue-700 font-tech">20+</span>
                <p className="text-xs font-semibold text-blue-900 mt-1">Dự án & Mô hình thực tế</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>* Bằng khen tập thể xuất sắc từ Ban Giám Hiệu nhà trường.</span>
            <a
              href="https://facebook.com/bdq.ssrc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>Xem thêm</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Phòng thực hành & Trang thiết bị */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 blur-3xl pointer-events-none rounded-full" />
        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-4 h-4" />
            Không Gian Sáng Chế (Makerspace)
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-tech">
            Phòng Thực Hành STEM Đạt Chuẩn
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Phòng thực hành STEM được nhà trường bố trí tại Tầng 3 Tòa C với đầy đủ trang thiết bị hiện đại phục vụ các buổi sinh hoạt chuyên môn:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-cyan-300 text-sm">Máy in 3D FDM</h4>
              <p className="text-xs text-slate-400 mt-1">Gia công các chi tiết vỏ cơ khí chính xác từ bản vẽ CAD mô hình.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-blue-300 text-sm">KIT Arduino & ESP32</h4>
              <p className="text-xs text-slate-400 mt-1">Hơn 30 bộ KIT thực hành cảm biến, động cơ, module mạng không dây.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-orange-300 text-sm">Trang thiết bị chế tạo</h4>
              <p className="text-xs text-slate-400 mt-1">Máy hàn thiếc, đồng hồ vạn năng, nguồn tổ ong và dụng cụ cơ khí chuyên dụng.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Join Form */}
      <div id="contact" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Liên hệ & Tuyển thành viên
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-tech">
              Đăng Ký Tham Gia CLB
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Dù bạn mới bắt đầu hay đã có kinh nghiệm lập trình/chế tạo, CLB BSSRC luôn mở rộng cánh cửa chào đón tất cả các bạn học sinh có tinh thần ham học hỏi!
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Phòng Thực hành STEM - Tầng 3 Tòa C, Trường THPT Bắc Đông Quan</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <Calendar className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Lịch sinh hoạt định kỳ: Chiều Thứ 5 & Sáng Thứ 7 hàng tuần</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <Mail className="w-5 h-5 text-blue-600 shrink-0" />
              <span>bdq.stemlab@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md glass-card">
          <h3 className="text-lg font-bold text-slate-900 mb-4 font-tech">
            Để lại thông tin để Ban Điều Hành liên hệ bạn:
          </h3>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn! Thông tin đăng ký đã được ghi nhận. Bạn cũng có thể nhắn tin trực tiếp tới Fanpage facebook.com/bdq.ssrc để nhận thông báo sớm nhất!'); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên học sinh *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Nam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lớp / Khối *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 10A1, 11A2..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại / Zalo *</label>
                <input
                  type="tel"
                  required
                  placeholder="09xx xxx xxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lĩnh vực quan tâm nhất</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Lập trình & Robotics</option>
                  <option>Nghiên cứu KHKT (Sinh học / Hóa học)</option>
                  <option>Thiết kế 3D & Chế tạo mô hình</option>
                  <option>Truyền thông & Chụp ảnh / Video</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ý tưởng hoặc mong muốn khi tham gia</label>
              <textarea
                rows={3}
                placeholder="Bạn muốn làm sản phẩm gì hoặc phát triển kỹ năng nào?..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
            >
              Gửi Đăng Ký Tham Gia CLB
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
