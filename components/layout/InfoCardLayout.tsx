import React from 'react';
import { cn } from '@/lib/utils';

export default function InfoCardLayout({
  className,
  title,
  children,
  icon,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex h-14 w-full items-center px-4 py-1.5 space-x-2 rounded-sm bg-custom-slate',
        className
      )}
    >
      {icon}
      <div className="space-y-1 text-center grow-1">
        <p className="text-xs text-custom-gray-200 leading-none">{title}</p>
        {children}
      </div>
    </div>
  );
}
