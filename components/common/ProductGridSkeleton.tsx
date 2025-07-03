import React from 'react';
import ItemCardSkeleton from './ItemCardSkeleton';

export default function ProductGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 items-center justify-center self-center gap-y-7 gap-x-4">
      {Array.from({ length: 7 }, (_, index) => (
        <ItemCardSkeleton key={index} />
      ))}
    </div>
  );
} 