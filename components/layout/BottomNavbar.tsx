'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { navItems } from '@/lib/nav-data';
import NavItem from './NavItem';

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed -bottom-0.5 left-0 right-0 bg-background h-20 flex items-center justify-between px-8 z-50">
      <ul className="flex flex-1 justify-between max-w-[480px] mx-auto items-center">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </ul>
    </nav>
  );
}
