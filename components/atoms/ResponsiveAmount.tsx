'use client';

import React from 'react';

interface ResponsiveAmountProps {
  amount: number;
  className?: string;
}

export function ResponsiveAmount({
  amount,
  className = '',
}: ResponsiveAmountProps) {
  const formattedAmount = amount.toLocaleString();
  const amountLength = formattedAmount.length;

  // 숫자 길이에 따라 폰트 크기 결정
  const getFontSize = (length: number) => {
    if (length <= 6) return 'text-7xl'; // 1,000,000 이하
    if (length <= 8) return 'text-6xl'; // 10,000,000 이하
    if (length <= 10) return 'text-5xl'; // 100,000,000 이하
    if (length <= 12) return 'text-4xl'; // 1,000,000,000 이하
    return 'text-4xl'; // 그 이상
  };

  const fontSize = getFontSize(amountLength);

  return (
    <div
      className={`flex items-baseline justify-center gap-1 h-16 ${className}`}
    >
      <h2 className={`${fontSize} font-bold text-white truncate`}>
        {formattedAmount}
      </h2>
      <span className="text-2xl font-bold text-white">원</span>
    </div>
  );
}
