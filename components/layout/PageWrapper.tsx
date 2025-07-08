import { cn } from '@/lib/utils';
import React from 'react';

export default function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-5 pt-8 space-y-5 pb-24', className)}>{children}</div>
  );
}
