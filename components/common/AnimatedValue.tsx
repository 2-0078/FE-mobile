'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedValueProps {
  value: number | string;
  className?: string;
  duration?: number;
  formatValue?: (value: number | string) => string;
  children?: React.ReactNode;
}

export default function AnimatedValue({
  value,
  className = '',
  duration = 1000,
  formatValue,
  children,
}: AnimatedValueProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationColor, setAnimationColor] = useState<
    'green' | 'red' | 'none'
  >('none');
  const prevValueRef = useRef(value);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      const prevValue = prevValueRef.current;
      const newValue = value;

      // 숫자인 경우에만 애니메이션 적용
      if (typeof prevValue === 'number' && typeof newValue === 'number') {
        const isIncrease = newValue > prevValue;
        setAnimationColor(isIncrease ? 'green' : 'red');
        setIsAnimating(true);

        // 애니메이션 시작
        const startValue = prevValue;
        const endValue = newValue;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // easeOutQuart 애니메이션
          const easeProgress = 1 - Math.pow(1 - progress, 4);
          const currentValue =
            startValue + (endValue - startValue) * easeProgress;

          setDisplayValue(currentValue);

          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            setDisplayValue(endValue);
            setIsAnimating(false);
            // 애니메이션 완료 후 색상 초기화
            setTimeout(() => {
              setAnimationColor('none');
            }, 500);
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      } else {
        // 문자열인 경우 즉시 업데이트
        setDisplayValue(newValue);
      }

      prevValueRef.current = value;
    }
  }, [value, duration]);

  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getAnimationClasses = () => {
    if (!isAnimating) return '';

    switch (animationColor) {
      case 'green':
        return 'animate-pulse text-green-600 font-bold';
      case 'red':
        return 'animate-pulse text-red-600 font-bold';
      default:
        return '';
    }
  };

  const formattedValue = formatValue
    ? formatValue(displayValue)
    : typeof displayValue === 'number'
      ? displayValue.toLocaleString()
      : displayValue;

  return (
    <span className={cn(getAnimationClasses(), className)}>
      {children || formattedValue}
    </span>
  );
}
