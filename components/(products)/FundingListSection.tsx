import React from 'react';
import Link from 'next/link';
import { Puzzle, Clock } from 'lucide-react';
import { FundingProductType } from '@/types/ProductTypes';
import ImageWithFallback from '@/components/common/ImageWithFallback';

// 유틸리티 함수들
const getDaysLeft = (deadline: string) => {
  // 클라이언트 사이드에서만 실행
  if (typeof window === 'undefined') {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const now = new Date();
  const end = new Date(deadline);
  const diff = end.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR').format(price);
};

// 이미지 URL을 가져오는 함수
const getProductImage = (product: FundingProductType) => {
  if (!product.images || product.images.length === 0) {
    return '/example.png'; // 기본 이미지
  }
  return product.images[0].imageUrl;
};

export function FundingListSection({
  fundingProducts,
}: {
  fundingProducts: FundingProductType[];
}) {
  const getProgressPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  return (
    <div className="space-y-4 px-4">
      {fundingProducts.map((product) => {
        const daysLeft = getDaysLeft(product.funding.fundingDeadline);
        const isDaysLeft = daysLeft.days > 0;
        const isHourLeft = daysLeft.days == 0 && daysLeft.hours > 0;
        const isExpired =
          daysLeft.days == 0 && daysLeft.hours == 0 && daysLeft.minutes < 5;

        const imageUrl = getProductImage(product);
        console.log(imageUrl);

        return (
          <div
            key={product.funding.fundingUuid}
            className="bg-dark-blue rounded-lg px-4 py-2 border h-30 border-slate-700/50"
          >
            <Link href={`/funding/${product.funding.fundingUuid}`}>
              <div className="flex items-center gap-3 relative">
                <div className="w-16 h-24 relative rounded-lg overflow-hidden bg-gray-200">
                  <ImageWithFallback
                    src={imageUrl}
                    alt={product.productName}
                    fill={true}
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">
                        {product.mainCategory.categoryName} &gt;{' '}
                        {product.subCategory.categoryName}
                      </p>
                      <h3 className="text-sm font-medium text-white">
                        {product.productName}
                      </h3>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-xs text-slate-400">조각당</p>
                      <p className="text-lg font-bold text-white">
                        {product.funding.piecePrice.toLocaleString()}원
                      </p>
                      <div className="text-xs text-slate-400">
                        총 {formatPrice(product.funding.fundingAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Puzzle className="w-3 h-3" />
                      <span>
                        {product.funding.availablePieces}/
                        {product.funding.totalPieces}
                      </span>
                      <span className="text-blue-400">
                        (
                        {getProgressPercentage(
                          product.funding.availablePieces,
                          product.funding.totalPieces
                        )}
                        %)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Clock
                        className={`w-3 h-3 ${
                          isExpired ? 'text-custom-red' : ''
                        }`}
                      />
                      <span
                        className={`${
                          isExpired ? 'text-custom-light-red' : ''
                        }`}
                      >
                        {isDaysLeft
                          ? `${daysLeft.days}일 뒤 종료`
                          : isHourLeft
                            ? `${daysLeft.hours}시간 뒤 종료`
                            : isExpired
                              ? '종료까지 5분미만'
                              : `${daysLeft.minutes}분 뒤 종료`}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-slate-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${getProgressPercentage(
                          product.funding.availablePieces,
                          product.funding.totalPieces
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
