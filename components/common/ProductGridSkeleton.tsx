import React from 'react';
import ItemCardSkeleton from './ItemCardSkeleton';
import FundingSwiperSkeleton from './FundingSwiperSkeleton';

export default function ProductGridSkeleton() {
  return (
    <div className="space-y-8">
      {/* 공모 상품 섹션 스켈레톤 */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
        <div className="rounded-2xl p-6">
          <FundingSwiperSkeleton />
        </div>
      </div>

      {/* 조각 상품 섹션 스켈레톤 */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 5 }, (_, index) => (
              <ItemCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 