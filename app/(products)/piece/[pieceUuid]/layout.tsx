import Header from '@/components/layout/Header';
import React from 'react';
export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header isAlert={false} className="px-4 pt-6" />
      {children}
    </>
  );
}
