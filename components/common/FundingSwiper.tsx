'use client';

import React, { useState, useEffect } from 'react';
import { FundingProductType } from '@/types/ProductTypes';
import FundingItemCard from './FundingItemCard';

interface FundingSwiperProps {
  products: FundingProductType[];
}

export default function FundingSwiper({ products }: FundingSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length]);

  if (products.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500">공모 상품이 없습니다</p>
      </div>
    );
  }

  // 16px gap을 고려한 이동 거리 계산
  // 각 아이템은 100% 너비 + 16px gap
  const moveDistance = currentIndex * (100 + 16);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-[16px]">
        {products.map((product, index) => (
          <div 
            key={product.productUuid} 
            className="w-full flex-shrink-0 transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(-${moveDistance}%)`
            }}
          >
            <FundingItemCard product={product} />
          </div>
        ))}
      </div>
      
      {/* 인디케이터 */}
      {products.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
} 