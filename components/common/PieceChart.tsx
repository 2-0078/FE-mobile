'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface ChartData {
  time: string;
  price: number;
  volume: number;
}

interface PieceChartProps {
  data: ChartData[];
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
}

export function PieceChart({
  data,
  currentPrice,
  priceChange,
  priceChangePercent,
}: PieceChartProps) {
  const [isPositive, setIsPositive] = useState(priceChange >= 0);

  useEffect(() => {
    setIsPositive(priceChange >= 0);
  }, [priceChange]);

  const formatPrice = (value: unknown) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value;
  };

  const formatTime = (value: unknown) => {
    if (typeof value === 'string') {
      return value;
    }
    return value;
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">가격 변동</h3>
        <div className="text-right">
          <div
            className={`text-lg font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}
          >
            ₩{currentPrice.toLocaleString()}
          </div>
          <div
            className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}
          >
            {isPositive ? '+' : ''}
            {priceChange.toLocaleString()} ({isPositive ? '+' : ''}
            {priceChangePercent}%)
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={formatTime}
            />
            <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={formatPrice} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB',
              }}
              formatter={(value: unknown) => [formatPrice(value), '가격']}
              labelFormatter={(label: unknown) => `시간: ${formatTime(label)}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#10B981' : '#EF4444'}
              fill={isPositive ? '#10B981' : '#EF4444'}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-gray-400 text-xs">거래량</div>
          <div className="text-white font-semibold">
            {data.reduce((sum, item) => sum + item.volume, 0).toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">평균가</div>
          <div className="text-white font-semibold">
            ₩
            {(
              data.reduce((sum, item) => sum + item.price, 0) / data.length
            ).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
