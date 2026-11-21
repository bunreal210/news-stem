'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import PortalTopBar from './PortalTopBar';
import Navbar from './Navbar';

export default function PortalHeader() {
  const pathname = usePathname();

  // Ẩn toàn bộ header public khi đang ở trang quản trị /admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full shadow-2xs">
      <PortalTopBar />
      <Navbar />
    </header>
  );
}
