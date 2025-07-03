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
    <h3 className={cn('font-semibold text-lg text-black truncate', className)}>
      {children}
    </h3>
  );
}
