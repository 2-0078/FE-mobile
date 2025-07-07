'use client';

import React, { useState, useEffect } from 'react';
import AnimatedPrice from './AnimatedPrice';
import ItemCardImage from './ItemCardImage';
import ItemCardInfo from './ItemCardInfo';
import { getMarketPrice } from '@/action/market-price-service';
import { PieceProductType, MarketPriceData } from '@/types/ProductTypes';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PieceItemCardProps {
  product: PieceProductType;
}

export default function PieceItemCard({ product }: PieceItemCardProps) {
  const { piece } = product;
  const [marketData, setMarketData] = useState<MarketPriceData | null>(null);
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);

  const thumbnailImage =
    product.images.find((img) => img.isThumbnail)?.imageUrl ||
    product.images[0]?.imageUrl;

  // 가격 우선순위: 시장가 > 종가 > AI 예측가
  const displayPrice =
    typeof piece.marketPrice === 'number' && piece.marketPrice > 0
      ? piece.marketPrice
      : piece.closingPrice || product.aiEstimatedPrice || 0;

  // 주가 데이터 가져오기
  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoadingMarketData(true);
      try {
        const response = await getMarketPrice(product.productUuid);
        console.log('Market price response:', response);
        if (response?.isSuccess && response.result) {
          setMarketData(response.result);
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      } finally {
        setIsLoadingMarketData(false);
      }
    };

    fetchMarketData();
  }, [product.productUuid]);

  // 주가 데이터가 있는 경우 표시 (더 명확한 조건)
  const hasMarketData =
    marketData &&
    typeof marketData.stckPrpr === 'number' &&
    typeof marketData.stckHgpr === 'number' &&
    typeof marketData.stckLwpr === 'number';

  console.log('Market data state:', {
    marketData,
    isLoadingMarketData,
    hasMarketData,
    stckPrpr: marketData?.stckPrpr,
    stckHgpr: marketData?.stckHgpr,
    stckLwpr: marketData?.stckLwpr,
  });

  return (
    <div className="w-full rounded-lg shadow-lg bg-white overflow-hidden relative mx-auto items-center justify-center">
      {/* 상한가 하한가를 표시하자 */}
      <ItemCardImage
        remainingTime={`${piece.tradeQuantity}개`}
        thumbnail={thumbnailImage}
        type="piece"
      />
      <div className="relative">
        <ItemCardInfo
          mainCategory={product.mainCategory.categoryName}
          subCategory={product.subCategory.categoryName}
          productName={product.productName}
          price={displayPrice}
          type="piece"
          priceComponent={<AnimatedPrice price={displayPrice} />}
        />

        {/* 주가 정보 표시 - 로딩 중에도 기본 레이아웃 유지 */}
        <div className="px-4 mt-[-10px] pb-3 flex justify-start items-center gap-2 min-h-[20px]">
          {isLoadingMarketData ? (
            // 로딩 중일 때 부드러운 스켈레톤 애니메이션
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-full"></div>
              <div className="w-16 h-3 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded"></div>
              <div className="w-12 h-3 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded"></div>
            </div>
          ) : hasMarketData && marketData ? (
            // 실제 데이터가 있을 때
            <>
              {marketData.prdyVrss > 0 ? (
                <TrendingUp className="w-3 h-3 text-red-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-blue-500" />
              )}
              <p
                className={cn(
                  'text-xs font-bold',
                  marketData.prdyVrss > 0 ? 'text-red-500' : 'text-blue-500'
                )}
              >
                {marketData.prdyVrss.toLocaleString()}원
              </p>
              <p
                className={cn(
                  'text-xs font-bold',
                  marketData.prdyCrt > 0 ? 'text-red-500' : 'text-blue-500'
                )}
              >
                ({marketData.prdyCrt.toFixed(2)}%)
              </p>
            </>
          ) : null}
        </div>
      </div>
      {/* 상세보기 버튼 */}
      <div className="absolute bottom-0 right-0 p-4 flex justify-center items-center">
        <Button className="w-fit">상세보기</Button>
      </div>
    </div>
  );
}
