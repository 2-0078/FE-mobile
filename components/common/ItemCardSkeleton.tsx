import React from 'react';

export default function ItemCardSkeleton() {
  return (
    <div className="w-full rounded-2xl shadow-lg bg-white overflow-hidden relative mx-auto items-center justify-center animate-pulse">
      {/* 이미지 스켈레톤 - 실제 ItemCardImage와 동일한 크기 */}
      <div className="relative w-full h-64 rounded-t-xl bg-gray-200">
        {/* 남은 시간 스켈레톤 */}
        <div className="absolute top-3 left-4 bg-gray-300 text-xs px-3 py-1 rounded-lg w-20 h-8"></div>
        {/* Highest Bid 스켈레톤 */}
        <div className="absolute bottom-3 left-4 bg-gray-300 text-xs px-2 py-0.5 rounded w-24 h-6"></div>
      </div>
      
      {/* 정보 스켈레톤 - 실제 ItemCardInfo와 동일한 구조 */}
      <div className="p-4">
        {/* 제목 스켈레톤 */}
        <div className="h-5 bg-gray-200 rounded mb-3 w-4/5"></div>
        
        {/* 조각 개수 스켈레톤 */}
        <div className="h-3 bg-gray-200 rounded mb-2 w-1/3"></div>
        
        {/* 진행률 바 스켈레톤 */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
          <div className="bg-gray-300 h-2.5 rounded-full w-2/3"></div>
        </div>
        
        {/* 가격 스켈레톤 */}
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
} 