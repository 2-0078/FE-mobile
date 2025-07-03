<<<<<<< HEAD
import { Clock, Puzzle } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, getDaysLeft } from "@/lib/utils";
import { FundingProductType } from "@/types/ProductTypes";
=======
import { Clock, Puzzle } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, getDaysLeft } from '@/lib/tool';
import { FundingProductType } from '@/types/ProductTypes';
>>>>>>> feat/productsPage

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
        return (
          <div
            key={product.funding.fundingUuid}
            className="bg-slate-800/50 rounded-lg px-4 py-2 border h-30 border-slate-700/50"
          >
            <Link href={`/funding/${product.funding.fundingUuid}`}>
              <div className="flex items-center gap-3 relative">
                <div className="w-16 h-24 relative rounded-lg flex items-center justify-center">
                  <Image
                    src="/example.png"
                    alt="example"
                    fill={true}
                    className="object-contain mx-auto"
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
