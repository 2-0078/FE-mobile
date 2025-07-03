'use client';

import React, { useState, useEffect } from 'react';

interface AnimatedPriceProps {
  price: number;
}

export default function AnimatedPrice({ price }: AnimatedPriceProps) {
  const [displayPrice, setDisplayPrice] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (price !== displayPrice) {
      setIsAnimating(true);
      
      const startPrice = displayPrice;
      const endPrice = price;
      const duration = 1000; // 1초
      const startTime = Date.now();

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutQuart 애니메이션
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentPrice = Math.floor(startPrice + (endPrice - startPrice) * easeProgress);

        setDisplayPrice(currentPrice);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayPrice(endPrice);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [price, displayPrice]);

  const formatPrice = (num: number) => {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}억`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}만`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}천`;
    }
    return num.toLocaleString();
  };

  return (
    <span className={`font-bold text-lg ${isAnimating ? 'text-green-600' : 'text-black'}`}>
      ₩{formatPrice(displayPrice)}
    </span>
  );
} 