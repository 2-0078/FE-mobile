'use client';

import React from 'react';
import Link from 'next/link';
import type { NavItem } from '@/lib/nav-data';

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
}

export default function NavItem({ item, isActive }: NavItemProps) {
  const { href, icon: Icon, isSpecial, label } = item;

  if (isSpecial) {
    return (
      <li>
        <div className="relative -mt-8 bg-custom-green rounded-full w-16 h-16 flex items-center justify-center shadow-lg border-4 border-[#0A0A1A]">
          <Link href={href} aria-label={label}>
            <Icon
              className={`${
                isActive ? 'fill-white stroke-white' : 'stroke-white'
              }`}
            />
          </Link>
        </div>
      </li>
    );
  }

  return (
    <li className="w-fit flex justify-center items-center">
      <Link href={href} className="relative" aria-label={label}>
        <Icon isActive={isActive} />
        {isActive && (
          <div className="absolute left-0 right-0 mx-auto -bottom-3 w-1.5 h-1.5 rounded-full bg-custom-green" />
        )}
      </Link>
    </li>
  );
}
