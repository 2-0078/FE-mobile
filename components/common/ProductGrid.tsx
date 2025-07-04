import React from 'react';
import { FundingProductType, PieceProductType } from '@/types/ProductTypes';
import FundingSwiper from './FundingSwiper';
import PieceProductList from './PieceProductList';

interface ProductGridProps {
  fundingProducts: FundingProductType[];
  pieceProducts: PieceProductType[];
}

export default function ProductGrid({
  fundingProducts,
  pieceProducts,
}: ProductGridProps) {
  return (
    <>
      {/* 공모 상품 섹션 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">공모</h2>
        <FundingSwiper products={fundingProducts} />
      </div>

      {/* 조각 상품 섹션 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">조각 상품 TOP 5</h2>
        <PieceProductList products={pieceProducts} />
      </div>
    </>
  );
}
