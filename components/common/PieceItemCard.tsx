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
import { marketStorage } from '@/lib/market-storage';
import { Skeleton } from '@/components/atoms';
import { useRouter } from 'next/navigation';

interface PieceItemCardProps {
  product: PieceProductType;
}

export default function PieceItemCard({ product }: PieceItemCardProps) {
  const router = useRouter();
  const { piece } = product;
  const [marketData, setMarketData] = useState<MarketPriceData | null>(null);
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);
  const [dataSource, setDataSource] = useState<'live' | 'cached' | 'none'>(
    'none'
  );

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
    console.log('product.productUuid', product.productUuid);
    console.log('Effect triggered for product:', product.productName);

    const fetchMarketData = async () => {
      // 이미 로딩 중이면 중복 호출 방지
      if (isLoadingMarketData) {
        console.log('Already loading, skipping...');
        return;
      }

      setIsLoadingMarketData(true);

      try {
        // 먼저 캐시된 데이터 확인
        const cachedData = marketStorage.getMarketData(product.productUuid);
        console.log('cachedData', cachedData);

        // 실시간 데이터 가져오기 시도
        const response = await getMarketPrice(piece.pieceProductUuid);
        console.log('API response:', response);

        if (response?.isSuccess && response.result) {
          // 실시간 데이터가 있으면 저장하고 사용
          console.log('response.result', response.result);
          setMarketData(response.result);
          setDataSource('live');
          marketStorage.saveMarketData(piece.pieceProductUuid, response.result);
        } else if (cachedData) {
          // 실시간 데이터가 없고 캐시된 데이터가 있으면 사용
          console.log('Using cached data:', cachedData);
          setMarketData(cachedData);
          setDataSource('cached');
        } else {
          // 둘 다 없으면 null
          console.log('No data available');
          setMarketData(null);
          setDataSource('none');
        }
      } catch (error) {
        console.error('Failed to fetch market data:', error);

        // 에러 발생 시 캐시된 데이터 확인
        const cachedData = marketStorage.getMarketData(product.productUuid);
        if (cachedData) {
          console.log('Using cached data after error:', cachedData);
          setMarketData(cachedData);
          setDataSource('cached');
        } else {
          console.log('No cached data available after error');
          setMarketData(null);
          setDataSource('none');
        }
      } finally {
        setIsLoadingMarketData(false);
      }
    };

    fetchMarketData();

    // SSE 알림을 감지하여 데이터 새로고침
    const handleSSEAlert = (event: MessageEvent) => {
      try {
        // Check if it's our SSE alert message
        if (event.data && event.data.type === 'SSE_ALERT') {
          const alertData = event.data.data;
          if (
            alertData.alertType === 'PIECE_PRICE_CHANGE' &&
            alertData.key === product.productUuid
          ) {
            console.log(
              'SSE alert received for this product, refreshing data...'
            );
            fetchMarketData();
          }
        }
      } catch {
        // Ignore parsing errors
      }
    };

    // SSE 이벤트 리스너 추가
    window.addEventListener('message', handleSSEAlert);

    return () => {
      window.removeEventListener('message', handleSSEAlert);
    };
  }, [product.productUuid]); // isLoadingMarketData 제거

  // 주가 데이터가 있는 경우 표시 (더 명확한 조건)
  const hasMarketData =
    marketData &&
    typeof marketData.stckPrpr === 'number' &&
    typeof marketData.stckHgpr === 'number' &&
    typeof marketData.stckLwpr === 'number';

  // 데이터 소스에 따른 표시 텍스트
  const getDataSourceText = () => {
    if (dataSource === 'cached') {
      return '전일 데이터';
    }
    return '';
  };

  const handleClick = () => {
    router.push(`/piece/${piece.pieceProductUuid}`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-full rounded-lg shadow-lg bg-white overflow-hidden relative mx-auto items-center justify-center"
    >
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
              <Skeleton width="w-3" height="h-3" rounded="full" />
              <Skeleton width="w-16" height="h-3" />
              <Skeleton width="w-12" height="h-3" />
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
                {marketData.prdyVrss.toLocaleString()}원{' '}
              </p>
              <p
                className={cn(
                  'text-xs font-bold',
                  marketData.prdyCrt > 0 ? 'text-red-500' : 'text-blue-500'
                )}
              >
                ({marketData.prdyCrt.toFixed(2)}%)
              </p>
              {dataSource === 'cached' && (
                <span className="text-xs text-gray-500 ml-1">
                  {getDataSourceText()}
                </span>
              )}
            </>
          ) : (
            // 데이터가 없을 때
            <span className="text-xs text-gray-500">거래값을 요청중입니다</span>
          )}
        </div>
      </div>
      {/* 상세보기 버튼 */}
      <div className="absolute bottom-0 right-0 p-4 flex justify-center items-center">
        <Button className="w-fit">상세보기</Button>
      </div>
    </div>
  );
}
