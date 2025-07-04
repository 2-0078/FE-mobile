import React from 'react';
import ItemCardSkeleton from './ItemCardSkeleton';
import FundingSwiperSkeleton from './FundingSwiperSkeleton';

export default function ProductGridSkeleton() {
  return (
    <div className="rounded-2xl">
      <FundingSwiperSkeleton />
    </div>
  );
}
