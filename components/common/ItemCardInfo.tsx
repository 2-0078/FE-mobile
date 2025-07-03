import React from 'react';
import ProductTitleWrapper from '@/components/layout/ProductTitleWrapper';
import RemainingPieces from '@/components/common/RemainingPieces';
import Price from '@/components/layout/Price';

interface ItemCardInfoProps {
  productName?: string;
  price?: number;
  progress?: number;
  remainingPieces?: number;
  totalPieces?: number;
  type?: 'funding' | 'piece';
  priceComponent?: React.ReactNode;
}

export default function ItemCardInfo({ 
  productName, 
  price, 
  progress, 
  remainingPieces, 
  totalPieces, 
  type, 
  priceComponent 
}: ItemCardInfoProps) {
  return (
    <div className="p-4">
      <ProductTitleWrapper>{productName || 'Girl with the Pearl Earring'}</ProductTitleWrapper>
      
      {/* 펀딩 상품인 경우 조각 개수 표시 */}
      {type === 'funding' && remainingPieces !== undefined && totalPieces !== undefined ? (
        <div className="mb-2">
          <div className="text-sm text-gray-600 mb-1">
            {remainingPieces}개 / {totalPieces}개
          </div>
          {progress !== undefined && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-custom-green h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        /* 조각 상품인 경우 기본 표시 */
        <div className="mb-2">
          {progress !== undefined ? (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-custom-green h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : (
            <RemainingPieces remainingPieces={1} totalPieces={100} />
          )}
        </div>
      )}
      
      {/* 가격 표시 - 커스텀 컴포넌트가 있으면 사용, 없으면 기본 Price 컴포넌트 사용 */}
      {priceComponent || <Price price={price || 15800000} />}
    </div>
  );
}
