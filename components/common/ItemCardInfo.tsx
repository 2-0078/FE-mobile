import React from 'react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import ProductTitleWrapper from '@/components/layout/ProductTitleWrapper';
import Price from '@/components/layout/Price';

interface ItemCardInfoProps {
  productName?: string;
  price?: number;
  progress?: number;
  remainingPieces?: number;
  totalPieces?: number;
  type?: 'funding' | 'piece';
  priceComponent?: React.ReactNode;
  fundingStatus?: 'FUNDING' | '' | 'FUNDING_SUCCESS';
  mainCategory?: string;
  subCategory?: string;
  description?: string;
}

export default function ItemCardInfo({
  productName,
  price,
  progress,
  remainingPieces,
  totalPieces,
  type,
  priceComponent,
  fundingStatus,
  mainCategory,
  subCategory,
  description,
}: ItemCardInfoProps) {
  // progress가 제공되지 않았고, total과 remaining이 있으면 자동 계산
  const calculatedProgress =
    progress !== undefined
      ? progress
      : remainingPieces !== undefined &&
          totalPieces !== undefined &&
          totalPieces > 0
        ? ((totalPieces - (totalPieces - remainingPieces)) / totalPieces) * 100
        : undefined;

  return (
    <div className="p-4 space-y-2">
      {/* 펀딩 상품인 경우 조각 개수 표시 */}
      {type === 'funding' &&
        remainingPieces !== undefined &&
        totalPieces !== undefined && (
          <div className="mb-2">
            {calculatedProgress !== undefined && (
              <div className="relative w-full bg-custom-green/30 rounded-full h-0.5 dark:bg-gray-700 my-4">
                <div
                  className="bg-custom-green h-0.5 rounded-full"
                  style={{
                    width: `${calculatedProgress}%`,
                    maxWidth: '100%',
                  }}
                />
                <p
                  className="w-fit text-[9px] text-white px-2 bg-black rounded-full absolute top-1/2 -translate-y-1/2 border border-custom-green"
                  style={{
                    left: `${Math.min(Math.max(calculatedProgress, 0), 77)}%`,
                  }}
                >
                  <span className="text-custom-green font-bold">
                    {remainingPieces}
                  </span>
                  / {totalPieces}
                </p>
              </div>
            )}
          </div>
        )}

      <div
        className={cn(
          type === 'funding' ? 'text-white' : 'text-black',
          'flex items-center gap-2  text-[0.725rem]'
        )}
      >
        <span className="text-custom-green">#{mainCategory}</span>
        <span className="text-custom-green">#{subCategory}</span>
      </div>
      <ProductTitleWrapper className={cn(type === 'funding' && '!text-white')}>
        {productName || 'Girl with the Pearl Earring'}
      </ProductTitleWrapper>
      {description && (
        <p className="text-white text-[0.725rem]">{description}</p>
      )}
      {/* 가격 표시 - 커스텀 컴포넌트가 있으면 사용, 없으면 기본 Price 컴포넌트 사용 */}
      {priceComponent || (
        <Price className="text-3xl font-bold" price={price || 15800000} />
      )}
      {fundingStatus === 'FUNDING' && (
        <Badge className="text-custom-green text-[0.6rem] bg-black absolute top-4 right-4 border border-custom-green py-1">
          {fundingStatus}
        </Badge>
      )}
    </div>
  );
}
