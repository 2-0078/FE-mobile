'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function ItemCardImage({
  remainingTime,
  thumbnail,
}: {
  remainingTime: string | React.ReactNode;
  thumbnail: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-64 rounded-t-xl overflow-hidden">
      {/* 스켈레톤 배경 */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* 이미지 */}
      <Image
        src={thumbnail}
        alt="artwork"
        fill={true}
        className={`object-cover object-top transition-all duration-300 ${
          isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />

      {/* 에러 상태 */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
          <div className="text-gray-500 text-sm">
            이미지를 불러올 수 없습니다
          </div>
        </div>
      )}

      {/* 남은 시간 */}
      <div className="absolute top-3 left-4 bg-black/15 backdrop-blur-sm text-xs px-3 py-1 rounded-lg shadow text-white">
        {typeof remainingTime === 'string' ? (
          <p className="text-center">
            남은 시간
            <br />
            {remainingTime}
          </p>
        ) : (
          remainingTime
        )}
      </div>

      {/* Highest Bid */}
      <div className="absolute bottom-3 left-4 bg-custom-red text-white text-xs px-2 py-0.5 rounded shadow">
        Highest Bid
      </div>
    </div>
  );
}
