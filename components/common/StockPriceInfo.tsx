'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MarketPriceData } from '@/types/ProductTypes';

interface StockPriceInfoProps {
  marketData: MarketPriceData;
  className?: string;
}

export default function StockPriceInfo({
  marketData,
  className = '',
}: StockPriceInfoProps) {
  const { stckHgpr, stckLwpr, prdyVrssSign, prdyVrss, prdyCrt } = marketData;

  // 등락 부호에 따른 아이콘과 색상 결정
  const getChangeInfo = () => {
    switch (prdyVrssSign) {
      case '1': // 상승
        return {
          icon: <TrendingUp className="w-3 h-3" />,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          sign: '+',
        };
      case '2': // 하락
        return {
          icon: <TrendingDown className="w-3 h-3" />,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          sign: '-',
        };
      case '3': // 보합
      default:
        return {
          icon: <Minus className="w-3 h-3" />,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          sign: '',
        };
    }
  };

  const changeInfo = getChangeInfo();

  return (
    <div className={`space-y-2 ${className}`}>
      {/* 현재가 및 등락 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <span className="text-lg font-bold text-gray-900">
            {stckPrpr.toLocaleString()}원
          </span> */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${changeInfo.bgColor}`}
          >
            {changeInfo.icon}
            <span className={`font-medium ${changeInfo.color}`}>
              {changeInfo.sign}
              {prdyVrss.toLocaleString()}
            </span>
            <span className={`font-medium ${changeInfo.color}`}>
              ({changeInfo.sign}
              {prdyCrt.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* 고가/저가 정보 */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">고가</span>
            <span className="font-medium text-red-500">
              {stckHgpr.toLocaleString()}원
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">저가</span>
            <span className="font-medium text-blue-500">
              {stckLwpr.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
