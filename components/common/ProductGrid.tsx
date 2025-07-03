import React from 'react';
import { getFundingProductsList, getFundingProduct, getPieceProductsList, getPieceProducts } from '@/action/product-service';
import FundingSwiper from './FundingSwiper';
import PieceProductList from './PieceProductList';

export default async function ProductGrid() {
  const [fundingProductsList, pieceProductsList] = await Promise.all([
    getFundingProductsList({ page: 1, size: 10 }),
    getPieceProductsList()
  ]);

  // 각 상품의 상세 정보 가져오기
  const [fundingProducts, pieceProducts] = await Promise.all([
    Promise.all(
      fundingProductsList.fundingUuidList.map(async (fundingUuid: string) => {
        try {
          return await getFundingProduct(fundingUuid);
        } catch (error) {
          console.error(`Failed to fetch funding product ${fundingUuid}:`, error);
          return null;
        }
      })
    ),
    Promise.all(
      pieceProductsList.pieceProductUuidList.map(async (pieceUuid: string) => {
        try {
          return await getPieceProducts(pieceUuid);
        } catch (error) {
          console.error(`Failed to fetch piece product ${pieceUuid}:`, error);
          return null;
        }
      })
    )
  ]);

  // null 값 필터링
  const validFundingProducts = fundingProducts.filter(product => product !== null);
  const validPieceProducts = pieceProducts.filter(product => product !== null);

  return (
    <div className="space-y-8">
      {/* 공모 상품 섹션 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">공모</h2>
        <div className="rounded-2xl">
          <FundingSwiper products={validFundingProducts} />
        </div>
      </div>

      {/* 조각 상품 섹션 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">조각 상품 TOP 5</h2>
        <PieceProductList products={validPieceProducts} />
      </div>
    </div>
  );
} 