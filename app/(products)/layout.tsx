'use client';

import React from 'react';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { usePathname } from 'next/navigation';

export default function ProductsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  // 상세 페이지에서는 BottomNav 숨기기
  const isDetailPage =
    pathname.includes('/funding/') || pathname.includes('/piece/');
  const shouldHideBottomNav = isDetailPage;

  return (
    <>
      {children}
      {!shouldHideBottomNav && <BottomNavbar />}
    </>
  );
}
