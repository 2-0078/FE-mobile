'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { CountdownTimer } from '../CountdownTimer';

interface ItemCardImageProps {
  thumbnail?: string;
  remainingTime: string;
  type: 'funding' | 'piece';
}

export default function ItemCardImage({
  remainingTime,
  thumbnail,
  type,
}: ItemCardImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-62 bg-gray-100 rounded-t-lg overflow-hidden">
      {hasError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-500">이미지 로드 실패</span>
        </div>
      ) : (
        <Image
          src={thumbnail || '/example.png'}
          alt="상품 이미지"
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover rounded-t-lg"
          onError={() => {
            setHasError(true);
          }}
        />
      )}
      {type === 'funding' && (
        <div className="absolute top-4 left-4 flex items-center justify-center z-10 text-white text-[0.725rem]">
          <CountdownTimer endDateTime={remainingTime} variant="card" />
        </div>
      )}
    </div>
  );
}
