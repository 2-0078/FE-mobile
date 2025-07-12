'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from 'recharts';

interface PriceData {
  time: string;
  price: number;
  volume: number;
}

interface PieceChartProps {
  data: PriceData[];
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
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      {/* 가격 정보 헤더 - 모바일 최적화 */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">현재가</p>
          <p
            className={`text-xl font-bold ${isPositive ? 'text-red-500' : 'text-blue-500'}`}
          >
            {currentPrice.toLocaleString()}원
          </p>
        </div>
        <div className="text-right">
          <p
            className={`text-xs font-medium ${isPositive ? 'text-red-500' : 'text-blue-500'}`}
          >
            {isPositive ? '+' : ''}
            {priceChange.toLocaleString()}원
          </p>
          <p
            className={`text-xs ${isPositive ? 'text-red-500' : 'text-blue-500'}`}
          >
            {isPositive ? '+' : ''}
            {priceChangePercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* 차트 - 모바일 높이 조정 */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? '#ef4444' : '#3b82f6'}
                  stopOpacity={0.1}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? '#ef4444' : '#3b82f6'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              stroke="#999"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#999"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toLocaleString()}`}
              domain={['dataMin - 100', 'dataMax + 100']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
              }}
              formatter={(value: any) => [
                `${value.toLocaleString()}원`,
                '가격',
              ]}
              labelFormatter={(label) => `시간: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#ef4444' : '#3b82f6'}
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 거래량 차트 - 모바일 높이 조정 */}
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              stroke="#999"
              fontSize={8}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#999"
              fontSize={8}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
              }}
              formatter={(value: any) => [
                `${value.toLocaleString()}`,
                '거래량',
              ]}
              labelFormatter={(label) => `시간: ${label}`}
            />
            <Bar dataKey="volume" fill="#6b7280" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
