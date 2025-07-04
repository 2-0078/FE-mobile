'use client';

import React, { useState, useEffect } from 'react';
import { PieceProductType, MarketPriceData } from '@/types/ProductTypes';
import { getMarketPrice } from '@/action/market-price-service';
import ItemCardImage from './ItemCardImage';
import ItemCardInfo from './ItemCardInfo';
import dynamic from 'next/dynamic';
import { Button } from '../ui/button';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// AnimatedPrice를 동적으로 import
const AnimatedPrice = dynamic(() => import('./AnimatedPrice'), {
  ssr: false,
  loading: () => <div className="h-8 bg-gray-200 animate-pulse rounded" />,
});

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
        console.log(response);
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

  // 주가 데이터가 있는 경우 표시
  const hasMarketData =
    marketData &&
    marketData.stckPrpr &&
    marketData.stckHgpr &&
    marketData.stckLwpr;

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

        {/* 주가 정보 표시 */}
        {isLoadingMarketData && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        )}

        {hasMarketData && marketData && (
          <div className="px-4 mt-[-10px] pb-3 flex justify-start items-center gap-2">
            {marketData.prdyVrss > 0 ? (
              <ArrowUpCircle className="w-3 h-3" color="red" />
            ) : (
              <ArrowDownCircle className="w-3 h-3" color="blue" />
            )}
            <p
              className={cn(
                'text-black text-xs font-bold',
                marketData.prdyVrss > 0 ? 'text-red-500' : 'text-blue-500'
              )}
            >
              {marketData.prdyVrss.toLocaleString()}원
            </p>
            <p
              className={cn(
                'text-black text-xs font-bold',
                marketData.prdyCrt > 0 ? 'text-red-500' : 'text-blue-500'
              )}
            >
              ({marketData.prdyCrt.toFixed(2)}%)
            </p>
          </div>
        )}
      </div>
      {/* 상세보기 버튼 */}
      <div className="absolute bottom-0 right-0 p-4 flex justify-center items-center">
        <Button className="w-fit">상세보기</Button>
      </div>
    </div>
  );
}
