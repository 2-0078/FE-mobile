'use client';

import React, { useState, useEffect } from 'react';
import { getPreviousDayQuotes } from '@/action/market-price-service';

interface TradeData {
  time: string;
  price: number;
  quantity: number;
  type: 'buy' | 'sell';
}

interface OrderHistoryProps {
  pieceUuid: string;
}

export default function OrderHistory({ pieceUuid }: OrderHistoryProps) {
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [previousDayQuotesData, setPreviousDayQuotesData] = useState<{
    askp: number[];
    bidp: number[];
    askpRsq: number[];
    bidpRsq: number[];
  } | null>(null);
  const [isLoadingPreviousDayData, setIsLoadingPreviousDayData] =
    useState(false);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/trading/history/${pieceUuid}`);
        const result = await response.json();

        if (result.success && result.data) {
          setTrades(result.data);
          setIsMarketOpen(true);
        } else {
          // API 응답이 없거나 실패한 경우 기본 데이터 사용
          const fallbackData: TradeData[] = [
            { time: '14:30:25', price: 14500, quantity: 5, type: 'buy' },
            { time: '14:29:18', price: 14450, quantity: 3, type: 'sell' },
            { time: '14:28:42', price: 14500, quantity: 8, type: 'buy' },
            { time: '14:27:15', price: 14400, quantity: 12, type: 'sell' },
            { time: '14:26:33', price: 14550, quantity: 6, type: 'buy' },
            { time: '14:25:47', price: 14450, quantity: 4, type: 'sell' },
            { time: '14:24:12', price: 14500, quantity: 10, type: 'buy' },
            { time: '14:23:28', price: 14400, quantity: 7, type: 'sell' },
            { time: '14:22:55', price: 14550, quantity: 9, type: 'buy' },
            { time: '14:21:33', price: 14450, quantity: 15, type: 'sell' },
          ];
          setTrades(fallbackData);
          setIsMarketOpen(false);

          // 장이 닫혀있을 때 전날 업데이트된 마지막 호가 데이터 가져오기
          setIsLoadingPreviousDayData(true);
          try {
            const previousDayQuotesResponse =
              await getPreviousDayQuotes(pieceUuid);
            if (
              previousDayQuotesResponse?.isSuccess &&
              previousDayQuotesResponse.result
            ) {
              setPreviousDayQuotesData(previousDayQuotesResponse.result);
            }
          } catch (error) {
            console.error('Error fetching previous day quotes:', error);
          } finally {
            setIsLoadingPreviousDayData(false);
          }
        }
      } catch (err) {
        console.error('Failed to fetch trade history:', err);
        setError('체결 내역을 불러오는데 실패했습니다.');
        setIsMarketOpen(false);

        // 에러 시에도 기본 데이터 표시
        const fallbackData: TradeData[] = [
          { time: '14:30:25', price: 14500, quantity: 5, type: 'buy' },
          { time: '14:29:18', price: 14450, quantity: 3, type: 'sell' },
          { time: '14:28:42', price: 14500, quantity: 8, type: 'buy' },
          { time: '14:27:15', price: 14400, quantity: 12, type: 'sell' },
          { time: '14:26:33', price: 14550, quantity: 6, type: 'buy' },
        ];
        setTrades(fallbackData);

        // 에러 시에도 전날 업데이트된 마지막 호가 데이터 가져오기
        setIsLoadingPreviousDayData(true);
        try {
          const previousDayQuotesResponse =
            await getPreviousDayQuotes(pieceUuid);
          if (
            previousDayQuotesResponse?.isSuccess &&
            previousDayQuotesResponse.result
          ) {
            setPreviousDayQuotesData(previousDayQuotesResponse.result);
          }
        } catch (error) {
          console.error('Error fetching previous day quotes:', error);
        } finally {
          setIsLoadingPreviousDayData(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTradeHistory();

    // 실시간 업데이트를 위한 인터벌 설정 (10초마다)
    const interval = setInterval(fetchTradeHistory, 10000);

    return () => clearInterval(interval);
  }, [pieceUuid]);

  // 장이 닫혀있을 때 표시할 컴포넌트
  if (!isMarketOpen && !loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-white">체결 내역</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs text-red-400">장 닫힘</span>
          </div>
        </div>

        <div className="text-center py-6">
          <div className="mb-4">
            <svg
              className="w-12 h-12 mx-auto text-gray-500 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-gray-400 mb-2">장이 닫혀있습니다</p>
            <p className="text-xs text-gray-500">장 시간: 09:00 - 15:30</p>
          </div>

          {/* 전날 업데이트된 마지막 호가 데이터 표시 */}
          {isLoadingPreviousDayData ? (
            <div className="mb-4 bg-gray-800 rounded p-3">
              <p className="text-xs text-gray-400 mb-2">전일 마지막 호가</p>
              <div className="animate-pulse">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">매도</p>
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="h-3 bg-gray-700 rounded mb-1"
                      ></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">매수</p>
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="h-3 bg-gray-700 rounded mb-1"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : previousDayQuotesData ? (
            <div className="mb-4 bg-gray-800 rounded p-3">
              <p className="text-xs text-gray-400 mb-2">전일 마지막 호가</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">매도</p>
                  {previousDayQuotesData.askp
                    .slice(0, 3)
                    .map((price, index) => (
                      <div key={index} className="text-xs text-red-400 mb-1">
                        {price.toLocaleString()}원
                      </div>
                    ))}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">매수</p>
                  {previousDayQuotesData.bidp
                    .slice(0, 3)
                    .map((price, index) => (
                      <div key={index} className="text-xs text-blue-400 mb-1">
                        {price.toLocaleString()}원
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="bg-gray-800 rounded p-3">
            <p className="text-xs text-gray-400 mb-1">장 시간 안내</p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>• 평일: 09:00 - 15:30</div>
              <div>• 주말 및 공휴일: 휴장</div>
              <div>• 점심시간: 11:30 - 13:00 (정상 거래)</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-base font-semibold text-white mb-3">체결 내역</h3>
        <div className="animate-pulse space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <div className="flex items-center space-x-2">
                <div className="h-3 bg-gray-700 rounded w-16"></div>
                <div className="h-3 bg-gray-700 rounded w-8"></div>
              </div>
              <div className="text-right">
                <div className="h-3 bg-gray-700 rounded w-20 mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-white">체결 내역</h3>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>

      <div className="space-y-2">
        {trades.map((trade, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">{trade.time}</span>
              <span
                className={`text-xs font-medium ${
                  trade.type === 'buy' ? 'text-blue-500' : 'text-red-500'
                }`}
              >
                {trade.type === 'buy' ? '매수' : '매도'}
              </span>
            </div>
            <div className="text-right">
              <div
                className={`text-xs font-medium ${
                  trade.type === 'buy' ? 'text-blue-500' : 'text-red-500'
                }`}
              >
                {trade.price.toLocaleString()}원
              </div>
              <div className="text-xs text-gray-500">
                {trade.quantity.toLocaleString()}개
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 거래량 요약 */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs text-gray-500">총 거래량</div>
            <div className="text-xs font-medium text-white">
              {trades
                .reduce((sum, trade) => sum + trade.quantity, 0)
                .toLocaleString()}
              개
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">매수 거래량</div>
            <div className="text-xs font-medium text-blue-500">
              {trades
                .filter((trade) => trade.type === 'buy')
                .reduce((sum, trade) => sum + trade.quantity, 0)
                .toLocaleString()}
              개
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">매도 거래량</div>
            <div className="text-xs font-medium text-red-500">
              {trades
                .filter((trade) => trade.type === 'sell')
                .reduce((sum, trade) => sum + trade.quantity, 0)
                .toLocaleString()}
              개
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
