'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FundingProductType } from '@/types/ProductTypes';
import FundingItemCard from './FundingItemCard';

interface FundingSwiperProps {
  products: FundingProductType[];
}

export default function FundingSwiper({ products }: FundingSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length, isDragging]);

  // 터치/마우스 시작
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  // 터치/마우스 이동
  const handleMove = (clientX: number) => {
    if (!isDragging) return;

    const diff = clientX - startX;
    const containerWidth = containerRef.current?.offsetWidth || 0;

    // gap-4 (16px)를 퍼센트로 계산
    const gapPercent = (16 / containerWidth) * 100;
    const itemWidthPercent = 100 + gapPercent; // 아이템 너비 + gap

    // gap을 고려한 이동 거리 계산
    const movePercent = (diff / containerWidth) * itemWidthPercent;

    setCurrentX(clientX);
    setTranslateX(movePercent);
  };

  // 터치/마우스 종료
  const handleEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);
    setTranslateX(0);

    const diff = currentX - startX;
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const threshold = containerWidth * 0.3; // 30% 이상 스와이프해야 이동

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        // 오른쪽으로 스와이프 - 이전 아이템
        setCurrentIndex(currentIndex - 1);
      } else if (diff < 0 && currentIndex < products.length - 1) {
        // 왼쪽으로 스와이프 - 다음 아이템
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  // 터치 이벤트
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // 마우스 이벤트
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // 마우스가 컨테이너를 벗어날 때
  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  if (products.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center">
        <p className="text-gray-500">공모 상품이 없습니다</p>
      </div>
    );
  }

  // gap을 고려한 이동 거리 계산
  const containerWidth = containerRef.current?.offsetWidth || 0;
  const gapPercent = containerWidth > 0 ? (16 / containerWidth) * 100 : 4;
  const itemWidthPercent = 100 + gapPercent;

  return (
    <div className="relative w-full overflow-hidden">
      <ul
        ref={containerRef}
        className="flex gap-[16px] cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ userSelect: 'none' }}
      >
        {products.map((product, index) => (
          <li
            key={product.productUuid}
            className="w-full flex-shrink-0 transition-transform duration-500 ease-in-out"
            style={{
              transform: isDragging
                ? `translateX(calc(-${currentIndex * itemWidthPercent}% + ${translateX}px))`
                : `translateX(calc(-${currentIndex * itemWidthPercent}%))`,
            }}
          >
            <FundingItemCard product={product} />
          </li>
        ))}
      </ul>

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
