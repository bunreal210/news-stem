import type { Metadata } from 'next';
import './globals.css';
import PortalHeader from '@/components/PortalHeader';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'CỔNG THÔNG TIN ĐIỆN TỬ STEM & ROBOTICS - THPT BẮC ĐÔNG QUAN (BSSRC)',
  description: 'Cổng thông tin điện tử Câu lạc bộ Nghiên cứu Khoa học, STEM và Robotics trường THPT Bắc Đông Quan (BSSRC). Nơi đăng tải thông báo, kế hoạch hoạt động, nghiên cứu KHKT và học liệu thực hành.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="flex flex-col min-h-screen bg-slate-50/60 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
        <PortalHeader />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
