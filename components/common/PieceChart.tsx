'use client';

import React, { useState, useEffect } from 'react';
import {
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
import {
  getHistoricalPrices,
  getRealTimePrice,
} from '@/action/market-price-service';
import { PeriodMarketPriceItem } from '@/types/ProductTypes';

interface PriceData {
  time: string;
  price: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface PieceChartProps {
  pieceUuid: string;
  currentPrice?: number;
  priceChange?: number;
  priceChangePercent?: number;
}

type PeriodType = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

export function PieceChart({
  pieceUuid,
  currentPrice: initialCurrentPrice = 0,
  priceChange: initialPriceChange = 0,
  priceChangePercent: initialPriceChangePercent = 0,
}: PieceChartProps) {
  const [data, setData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState(initialCurrentPrice);
  const [priceChange, setPriceChange] = useState(initialPriceChange);
  const [priceChangePercent, setPriceChangePercent] = useState(
    initialPriceChangePercent
  );
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('1Y');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const periods: { value: PeriodType; label: string }[] = [
    { value: '1Y', label: '1년' },
    { value: '6M', label: '6개월' },
    { value: '3M', label: '3개월' },
    { value: '1M', label: '1개월' },
    { value: '1W', label: '1주' },
    { value: '1D', label: '1일' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 기간별 시세 데이터 가져오기
        const historicalData = await getHistoricalPrices(
          pieceUuid,
          selectedPeriod
        );

        if (
          historicalData &&
          historicalData.result &&
          historicalData.result.periodMarketPriceList
        ) {
          const chartData: PriceData[] =
            historicalData.result.periodMarketPriceList
              .sort(
                (a, b) =>
                  new Date(a.stckBsopDate).getTime() -
                  new Date(b.stckBsopDate).getTime()
              )
              .map((item: PeriodMarketPriceItem) => ({
                time: new Date(item.stckBsopDate).toLocaleDateString('ko-KR', {
                  month: '2-digit',
                  day: '2-digit',
                }),
                price: item.stckClpr, // 종가를 메인 가격으로 사용
                volume: item.acmlVol,
                open: item.stckOprc,
                high: item.stckHgpr,
                low: item.stckLwpr,
                close: item.stckClpr,
              }));

          setData(chartData);

          // 요약 정보 업데이트 (가장 최근 데이터 기준)
          if (chartData.length > 0) {
            const latest = chartData[chartData.length - 1];
            const previous =
              chartData.length > 1 ? chartData[chartData.length - 2] : latest;

            setCurrentPrice(latest.close);
            const change = latest.close - previous.close;
            const changePercent = (change / previous.close) * 100;

            setPriceChange(change);
            setPriceChangePercent(changePercent);
          }
        } else {
          // API 응답이 없거나 실패한 경우 기본 데이터 사용
          const fallbackData: PriceData[] = [
            {
              time: '09:00',
              price: 14000,
              volume: 100,
              open: 14000,
              high: 14200,
              low: 13900,
              close: 14100,
            },
            {
              time: '10:00',
              price: 14200,
              volume: 150,
              open: 14100,
              high: 14300,
              low: 14000,
              close: 14200,
            },
            {
              time: '11:00',
              price: 14100,
              volume: 120,
              open: 14200,
              high: 14300,
              low: 14000,
              close: 14100,
            },
            {
              time: '12:00',
              price: 14300,
              volume: 200,
              open: 14100,
              high: 14400,
              low: 14100,
              close: 14300,
            },
            {
              time: '13:00',
              price: 14500,
              volume: 180,
              open: 14300,
              high: 14500,
              low: 14200,
              close: 14500,
            },
            {
              time: '14:00',
              price: 14400,
              volume: 160,
              open: 14500,
              high: 14500,
              low: 14300,
              close: 14400,
            },
            {
              time: '15:00',
              price: 14600,
              volume: 220,
              open: 14400,
              high: 14600,
              low: 14400,
              close: 14600,
            },
            {
              time: '16:00',
              price: 14500,
              volume: 190,
              open: 14600,
              high: 14600,
              low: 14400,
              close: 14500,
            },
          ];
          setData(fallbackData);
          setCurrentPrice(14500);
          setPriceChange(500);
          setPriceChangePercent(3.57);
        }
      } catch (err) {
        console.error('Failed to fetch historical data:', err);
        setError('차트 데이터를 불러오는데 실패했습니다.');

        // 에러 시에도 기본 데이터 표시
        const fallbackData: PriceData[] = [
          {
            time: '09:00',
            price: 14000,
            volume: 100,
            open: 14000,
            high: 14200,
            low: 13900,
            close: 14100,
          },
          {
            time: '10:00',
            price: 14200,
            volume: 150,
            open: 14100,
            high: 14300,
            low: 14000,
            close: 14200,
          },
          {
            time: '11:00',
            price: 14100,
            volume: 120,
            open: 14200,
            high: 14300,
            low: 14000,
            close: 14100,
          },
          {
            time: '12:00',
            price: 14300,
            volume: 200,
            open: 14100,
            high: 14400,
            low: 14100,
            close: 14300,
          },
          {
            time: '13:00',
            price: 14500,
            volume: 180,
            open: 14300,
            high: 14500,
            low: 14200,
            close: 14500,
          },
          {
            time: '14:00',
            price: 14400,
            volume: 160,
            open: 14500,
            high: 14500,
            low: 14300,
            close: 14400,
          },
          {
            time: '15:00',
            price: 14600,
            volume: 220,
            open: 14400,
            high: 14600,
            low: 14400,
            close: 14600,
          },
          {
            time: '16:00',
            price: 14500,
            volume: 190,
            open: 14600,
            high: 14600,
            low: 14400,
            close: 14500,
          },
        ];
        setData(fallbackData);
        setCurrentPrice(14500);
        setPriceChange(500);
        setPriceChangePercent(3.57);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pieceUuid, selectedPeriod]);

  // 실시간 가격 업데이트 (1분마다)
  useEffect(() => {
    const updateRealTimePrice = async () => {
      try {
        const realTimeData = await getRealTimePrice(pieceUuid);
        if (realTimeData && realTimeData.result) {
          setCurrentPrice(realTimeData.result.price);
          setPriceChange(realTimeData.result.change);
          setPriceChangePercent(realTimeData.result.changePercent);
        }
      } catch (err) {
        console.error('Failed to fetch real-time price:', err);
      }
    };

    const interval = setInterval(updateRealTimePrice, 60000); // 1분마다
    return () => clearInterval(interval);
  }, [pieceUuid]);

  const isPositive = priceChange >= 0;

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 space-y-4">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="text-right">
              <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      {/* 기간 선택 버튼 */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>

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
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()}원`,
                name === 'price' ? '가격' : name,
              ]}
              labelFormatter={(label) => `날짜: ${label}`}
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
              formatter={(value: number) => [
                `${value.toLocaleString()}`,
                '거래량',
              ]}
              labelFormatter={(label) => `날짜: ${label}`}
            />
            <Bar dataKey="volume" fill="#6b7280" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
