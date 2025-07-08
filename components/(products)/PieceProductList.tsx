'use client';

import React from 'react';
import { PieceProductType } from '@/types/ProductTypes';
import PieceItemCard from '@/components/common/PieceItemCard';

interface PieceProductListProps {
  products: PieceProductType[];
}

export default function PieceProductList({ products }: PieceProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-2">검색된 상품이 없습니다</div>
        <div className="text-sm text-gray-600">
          다른 카테고리 & 검색어를 입력해보세요
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4">
      {products.map((product) => {
        // null 체크 추가
        if (!product || !product.piece) {
          console.error('Invalid product data:', product);
          return null;
        }

        return (
          <PieceItemCard
            key={product.piece.pieceProductUuid}
            product={product}
          />
        );
      })}
    </div>
  );
}
