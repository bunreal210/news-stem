import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'CLB STEM & Sáng Tạo Trẻ - Cổng Thông Tin & Hoạt Động',
  description: 'Trang thông tin, tin tức, bài viết, hình ảnh và video hoạt động của Câu lạc bộ STEM trường học.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="flex flex-col min-h-screen text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
