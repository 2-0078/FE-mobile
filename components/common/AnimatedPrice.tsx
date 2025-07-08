'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AnimatedPriceProps {
  price: number;
}

export default function AnimatedPrice({ price }: AnimatedPriceProps) {
  const [displayPrice, setDisplayPrice] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (price !== displayPrice) {
      setIsAnimating(true);
      startTimeRef.current = null;

      const startPrice = displayPrice;
      const endPrice = price;
      const duration = 1000; // 1초

      const animate = (timestamp: number) => {
        // 첫 번째 프레임에서 시작 시간 설정
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutQuart 애니메이션
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentPrice = Math.floor(
          startPrice + (endPrice - startPrice) * easeProgress
        );

        setDisplayPrice(currentPrice);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayPrice(endPrice);
          setIsAnimating(false);
          startTimeRef.current = null;
        }
      };

      requestAnimationFrame(animate);
    }
  }, [price, isMounted]); // displayPrice를 의존성 배열에서 제거

  // 서버 사이드 렌더링 시 기본 가격 표시
  if (!isMounted) {
    return (
      <p className="font-bold tracking-tighter text-3xl text-black">
        {price.toLocaleString()}
        <span className="text-sm text-gray-500 pl-1">원</span>
      </p>
    );
  }

  return (
    <p
      className={`font-bold tracking-tighter text-3xl ${isAnimating ? 'text-green-600' : 'text-black'}`}
    >
      {displayPrice.toLocaleString()}
      <span className="text-sm text-gray-500 pl-1">원</span>
    </p>
  );
}
