'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import CardIcon from '@/repo/ui/Icons/CardIcon';
import HomeIcon from '@/repo/ui/Icons/HomeIcon';
import MyPageIcon from '@/repo/ui/Icons/MyPageIcon';
import OtherIcon from '@/repo/ui/Icons/OtherIcon';
import { Puzzle } from 'lucide-react';
export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed -bottom-0.5 left-0 right-0 bg-background h-20 flex items-center justify-between px-8 z-50">
      <ul className="flex flex-1 justify-between max-w-[480px] mx-auto items-center">
        <li>
          <Link href="/main" className="relative">
            <HomeIcon isActive={pathname === '/main'} />
            {pathname === '/main' && (
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </Link>
        </li>
        <li>
          <Link href="/funding" className="relative">
            <CardIcon isActive={pathname === '/funding'} />
            {pathname === '/funding' && (
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </Link>
        </li>

        <li>
          <div className="relative -mt-8 bg-custom-green rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-[#0A0A1A]">
            <Link href="/piece">
              <Puzzle
                className={`${
                  pathname === '/piece'
                    ? 'fill-white stroke-white'
                    : 'stroke-white'
                }`}
              />
            </Link>
          </div>
        </li>
        {/* Profile */}
        <li>
          <Link href="/mywallet" className="relative">
            <MyPageIcon isActive={pathname === '/mywallet'} />
            {pathname === '/mywallet' && (
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </Link>
        </li>

        {/* Stats */}
        <li>
          <Link href="/other" className="relative">
            <OtherIcon isActive={pathname === '/other'} />
            {pathname === '/other' && (
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
