'use client';

import React from 'react';
import { PieceProductType } from '@/types/ProductTypes';
import PieceItemCard from './PieceItemCard';

interface PieceProductListProps {
  products: PieceProductType[];
}

export default function PieceProductList({ products }: PieceProductListProps) {
  // TOP 5만 표시
  const top5Products = products.slice(0, 5);

  if (top5Products.length === 0) {
    return (
      <div className="w-full bg-gray-100 rounded-2xl  flex items-center justify-center">
        <p className="text-gray-500">조각 상품이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {top5Products.map((product) => (
        <PieceItemCard key={product.productUuid} product={product} />
      ))}
    </div>
  );
}
