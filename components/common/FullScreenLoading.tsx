'use client';

import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface FullScreenLoadingProps {
  text?: string;
  textSize?: 'xs' | 'sm' | 'base' | 'lg';
  spinnerSize?: 'sm' | 'md' | 'lg';
  spinnerVariant?: 'spinner' | 'dots' | 'pulse';
  showText?: boolean;
  className?: string;
  delay?: number; // 로딩 표시 지연 시간 (ms)
  preventFlash?: boolean; // 깜빡임 방지
}

export default function FullScreenLoading({
  text = 'loading...',
  textSize = 'xs',
  spinnerSize = 'sm',
  spinnerVariant = 'dots',
  showText = true,
  className = '',
  delay = 200,
  preventFlash = true,
}: FullScreenLoadingProps) {
  const [shouldShow, setShouldShow] = useState(!preventFlash);

  useEffect(() => {
    if (preventFlash) {
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay, preventFlash]);

  // 빠른 로딩의 경우 로딩 화면을 표시하지 않음
  if (!shouldShow) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 ${className}`}
    >
      <LoadingSpinner
        size={spinnerSize}
        variant={spinnerVariant}
        showText={showText}
        text={text}
        textSize={textSize}
      />
    </div>
  );
}
