import { cn } from '@/lib/utils';
import React from 'react';

export default function ProductTitleWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        'font-semibold text-[1.2rem] text-black line-clamp-2 break-words leading-tight',
        className
      )}
      style={{
        wordBreak: 'keep-all',
      }}
    >
      {children}
    </h3>
  );
}
