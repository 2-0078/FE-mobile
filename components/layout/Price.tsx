import React from 'react';
import { cn } from '@/lib/utils';
export default function Price({
  price,
  className,
}: {
  price: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'w-full flex justify-end text-xl font-bold text-white mt-2',
        className
      )}
    >
      <p>
        {price.toLocaleString()}
        <span className="text-sm text-gray-500 pl-1">원</span>
      </p>
    </div>
  );
}
