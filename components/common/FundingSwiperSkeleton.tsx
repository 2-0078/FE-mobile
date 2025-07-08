import React from 'react';
import ItemCardSkeleton from './ItemCardSkeleton';
import { Skeleton } from '@/components/atoms';

export default function FundingSwiperSkeleton() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-[16px]">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <ItemCardSkeleton />
          </div>
        ))}
      </div>

      {/* 인디케이터 스켈레톤 */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} width="w-2" height="h-2" rounded="full" />
        ))}
      </div>
    </div>
  );
}
