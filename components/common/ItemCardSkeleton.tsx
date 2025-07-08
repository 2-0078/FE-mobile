import React from 'react';
import { Skeleton } from '@/components/atoms';

export default function ItemCardSkeleton() {
  return (
    <div className="w-full rounded-2xl shadow-lg bg-white overflow-hidden relative mx-auto items-center justify-center">
      {/* 이미지 스켈레톤 - 실제 ItemCardImage와 동일한 크기 */}
      <div className="relative w-full h-64 rounded-t-xl">
        <Skeleton height="h-64" rounded="xl" className="rounded-t-xl" />
        {/* 남은 시간 스켈레톤 */}
        <div className="absolute top-3 left-4">
          <Skeleton width="w-20" height="h-8" rounded="lg" />
        </div>
        {/* Highest Bid 스켈레톤 */}
        <div className="absolute bottom-3 left-4">
          <Skeleton width="w-24" height="h-6" rounded="md" />
        </div>
      </div>

      {/* 정보 스켈레톤 - 실제 ItemCardInfo와 동일한 구조 */}
      <div className="p-4">
        {/* 제목 스켈레톤 */}
        <Skeleton height="h-5" className="mb-3 w-4/5" />

        {/* 조각 개수 스켈레톤 */}
        <Skeleton height="h-3" className="mb-2 w-1/3" />

        {/* 진행률 바 스켈레톤 */}
        <div className="w-full mb-3">
          <Skeleton height="h-2.5" rounded="full" />
          <div className="mt-1">
            <Skeleton height="h-2.5" rounded="full" width="w-2/3" />
          </div>
        </div>

        {/* 가격 스켈레톤 */}
        <Skeleton height="h-6" className="w-1/2" />
      </div>
    </div>
  );
}
