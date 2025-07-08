'use client';

import React from 'react';
import { Wallet } from 'lucide-react';

interface BalanceDisplayProps {
  balance: number;
  isLoading: boolean;
  iconColor?: string;
}

export function BalanceDisplay({
  balance,
  isLoading,
  iconColor = 'text-custom-green',
}: BalanceDisplayProps) {
  return (
    <div className="">
      <div className="text-start">
        <div className="flex items-center justify-start mb-2">
          <Wallet className={`w-6 h-6 ${iconColor} mr-2`} />
          <p className="text-gray-400">현재 잔액</p>
        </div>
        <h2 className="text-[40px] font-bold text-white">
          {isLoading ? '로딩 중...' : `${balance.toLocaleString()}원`}
        </h2>
      </div>
    </div>
  );
}
