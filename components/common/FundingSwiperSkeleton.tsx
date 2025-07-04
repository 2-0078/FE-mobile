import React from 'react';
import ItemCardSkeleton from './ItemCardSkeleton';

export default function FundingSwiperSkeleton() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-[16px]">
        {Array.from({ length: 3 }, (_, index) => (
          <div 
            key={index} 
            className="w-full flex-shrink-0"
          >
            <ItemCardSkeleton />
          </div>
        ))}
      </div>
      
      {/* 인디케이터 스켈레톤 */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
} 