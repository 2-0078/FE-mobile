'use client';

import React, { useState, useEffect } from 'react';
import {
  getOrderBook,
  getPreviousDayQuotes,
} from '@/action/market-price-service';
import { OrderBookItem } from '@/types/ProductTypes';
import { RealTimeQuotesData } from '@/types/ProductTypes';
import QuotesStreamService from '@/services/QuotesStreamService';

interface OrderBookProps {
  pieceUuid: string;
}

export default function OrderBook({ pieceUuid }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<{
    asks: OrderBookItem[];
    bids: OrderBookItem[];
    lastPrice: number;
    change: number;
    changePercent: number;
    spread: number;
    volume: number;
  }>({
    asks: [],
    bids: [],
    lastPrice: 0,
    change: 0,
    changePercent: 0,
    spread: 0,
    volume: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [connectionTimeout, setConnectionTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [previousDayQuotesData, setPreviousDayQuotesData] = useState<{
    askp: number[];
    bidp: number[];
    askpRsq: number[];
    bidpRsq: number[];
  } | null>(null);
  const [isLoadingPreviousDayData, setIsLoadingPreviousDayData] =
    useState(false);

  // 장 시간 체크 함수
  const isMarketOpenTime = () => {
    const now = new Date();
    const day = now.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 100 + minute; // HHMM 형식

    // 주말 체크
    if (day === 0 || day === 6) {
      return false;
    }

    // 장 시간 체크 (09:00-15:30)
    const marketOpen = 900; // 09:00
    const marketClose = 1530; // 15:30

    return currentTime >= marketOpen && currentTime <= marketClose;
  };

  // SSE 실시간 호가 데이터 처리
  const handleQuotesUpdate = (data: RealTimeQuotesData) => {
    console.log('실시간 호가 업데이트:', data);

    const asks: OrderBookItem[] = data.askp
      .map((price, index) => ({
        price,
        quantity: data.askpRsqn[index] || 0,
        total: price * (data.askpRsqn[index] || 0),
      }))
      .filter((item) => item.quantity > 0); // 수량이 0인 호가 제외

    const bids: OrderBookItem[] = data.bidp
      .map((price, index) => ({
        price,
        quantity: data.bidRsqn[index] || 0,
        total: price * (data.bidRsqn[index] || 0),
      }))
      .filter((item) => item.quantity > 0); // 수량이 0인 호가 제외

    // 스프레드 계산
    const spread =
      asks.length > 0 && bids.length > 0 ? asks[0].price - bids[0].price : 0;

    // 거래량 계산
    const totalVolume = [...asks, ...bids].reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    setOrderBook({
      asks: asks.sort((a, b) => a.price - b.price), // 매도는 낮은 가격부터
      bids: bids.sort((a, b) => b.price - a.price), // 매수는 높은 가격부터
      lastPrice: bids.length > 0 ? bids[0].price : 0,
      change: 0, // 실시간 데이터에서는 변동폭 계산 어려움
      changePercent: 0,
      spread,
      volume: totalVolume,
    });

    setIsConnected(true);
    setIsMarketOpen(true);
    setLoading(false);
    setError(null); // 연결 성공 시 에러 메시지 제거
  };

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getOrderBook(pieceUuid);

        if (data && data.result) {
          setOrderBook({
            asks: data.result.asks || [],
            bids: data.result.bids || [],
            lastPrice: data.result.lastPrice || 0,
            change: data.result.change || 0,
            changePercent: data.result.changePercent || 0,
            spread: data.result.spread || 0,
            volume: data.result.volume || 0,
          });
        } else {
          // API 응답이 없거나 실패한 경우 기본 데이터 사용
          const fallbackData = {
            asks: [
              { price: 15000, quantity: 10, total: 150000 },
              { price: 14900, quantity: 15, total: 223500 },
              { price: 14800, quantity: 20, total: 296000 },
              { price: 14700, quantity: 25, total: 367500 },
              { price: 14600, quantity: 30, total: 438000 },
            ],
            bids: [
              { price: 14500, quantity: 12, total: 174000 },
              { price: 14400, quantity: 18, total: 259200 },
              { price: 14300, quantity: 22, total: 314600 },
              { price: 14200, quantity: 28, total: 397600 },
              { price: 14100, quantity: 35, total: 493500 },
            ],
            lastPrice: 14500,
            change: 500,
            changePercent: 3.57,
            spread: 100,
            volume: 1000,
          };
          setOrderBook(fallbackData);
        }
      } catch (err) {
        console.error('Failed to fetch order book:', err);
        setError('호가 데이터를 불러오는데 실패했습니다.');

        // 에러 시에도 기본 데이터 표시
        const fallbackData = {
          asks: [
            { price: 15000, quantity: 10, total: 150000 },
            { price: 14900, quantity: 15, total: 223500 },
            { price: 14800, quantity: 20, total: 296000 },
            { price: 14700, quantity: 25, total: 367500 },
            { price: 14600, quantity: 30, total: 438000 },
          ],
          bids: [
            { price: 14500, quantity: 12, total: 174000 },
            { price: 14400, quantity: 18, total: 259200 },
            { price: 14300, quantity: 22, total: 314600 },
            { price: 14200, quantity: 28, total: 397600 },
            { price: 14100, quantity: 35, total: 493500 },
          ],
          lastPrice: 14500,
          change: 500,
          changePercent: 3.57,
          spread: 100,
          volume: 1000,
        };
        setOrderBook(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    // 초기 데이터 로드
    fetchOrderBook();

    // SSE 실시간 연결
    const quotesService = QuotesStreamService.getInstance();
    const disconnect = quotesService.connectToQuotesStream(
      pieceUuid,
      handleQuotesUpdate
    );

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      disconnect();
    };
  }, [pieceUuid]);

  // 연결 타임아웃 관리
  useEffect(() => {
    if (isConnected) {
      // 연결이 성공했으면 타임아웃 제거
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        setConnectionTimeout(null);
      }
      return;
    }

    // 연결되지 않은 상태에서만 타임아웃 설정
    if (!isConnected && !connectionTimeout) {
      const timeout = setTimeout(async () => {
        // 장 시간을 체크하여 실제로 장이 닫혀있는지 확인
        if (!isMarketOpenTime()) {
          setIsMarketOpen(false);
          setError(
            '장이 닫혀있습니다. 장 시간(09:00-15:30)에 다시 시도해주세요.'
          );

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
        } else {
          // 장이 열려있지만 연결이 안된 경우 에러 메시지 표시
          setError(
            '호가 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.'
          );
          setLoading(false); // 로딩 상태 해제
        }
      }, 8000); // 타임아웃 시간을 8초로 단축

      setConnectionTimeout(timeout);
    }

    return () => {
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
    };
  }, [isConnected, pieceUuid, connectionTimeout]);

  const maxTotal = Math.max(
    ...orderBook.asks.map((ask) => ask.total),
    ...orderBook.bids.map((bid) => bid.total)
  );

  // 장이 닫혀있을 때 표시할 컴포넌트 (실시간 데이터 업데이트 중이 아닐 때만)
  if (
    !isMarketOpen &&
    !loading &&
    !isConnected &&
    error?.includes('장이 닫혀있습니다')
  ) {
    return (
      <div className="bg-gray-900 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-semibold text-white">호가창</h3>
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
        <h3 className="text-base font-semibold text-white mb-3">호가창</h3>
        <div className="text-center py-6">
          <div className="mb-4">
            <div className="animate-spin w-8 h-8 border-2 border-gray-600 border-t-white rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-400">호가를 가져오고 있습니다</p>
            <p className="text-xs text-gray-500 mt-1">
              실시간 데이터 연결 중...
            </p>
          </div>
          <div className="animate-pulse">
            <div className="grid grid-cols-2 gap-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="space-y-1">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-white">호가창</h3>
        <div className="flex items-center space-x-2">
          {isConnected && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">실시간</span>
            </div>
          )}
          {error && !isConnected && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-400">연결 실패</span>
            </div>
          )}
          {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
      </div>

      {/* 현재가 정보 */}
      <div className="mb-3 p-2 bg-gray-800 rounded">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">현재가</span>
          <span className="text-sm font-medium text-white">
            {orderBook.lastPrice.toLocaleString()}원
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-400">변동</span>
          <span
            className={`text-xs font-medium ${
              orderBook.change > 0
                ? 'text-red-500'
                : orderBook.change < 0
                  ? 'text-blue-500'
                  : 'text-gray-400'
            }`}
          >
            {orderBook.change > 0 ? '+' : ''}
            {orderBook.change.toLocaleString()}원 (
            {orderBook.changePercent > 0 ? '+' : ''}
            {orderBook.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* 매도 호가 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-400">매도</span>
            <span className="text-xs text-gray-500">수량</span>
          </div>
          <div className="space-y-1">
            {orderBook.asks.map((ask, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs font-medium text-red-500">
                    {ask.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {ask.quantity.toLocaleString()}
                  </span>
                </div>
                {/* 배경 바 */}
                <div
                  className="absolute inset-0 bg-red-900 opacity-30 rounded"
                  style={{
                    width: `${(ask.total / maxTotal) * 100}%`,
                    right: 0,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 매수 호가 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-400">매수</span>
            <span className="text-xs text-gray-500">수량</span>
          </div>
          <div className="space-y-1">
            {orderBook.bids.map((bid, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs font-medium text-blue-500">
                    {bid.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {bid.quantity.toLocaleString()}
                  </span>
                </div>
                {/* 배경 바 */}
                <div
                  className="absolute inset-0 bg-blue-900 opacity-30 rounded"
                  style={{
                    width: `${(bid.total / maxTotal) * 100}%`,
                    left: 0,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 스프레드 및 거래량 정보 */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400">스프레드</span>
          <span className="text-xs font-medium text-white">
            {orderBook.spread.toLocaleString()}원
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">거래량</span>
          <span className="text-xs font-medium text-white">
            {orderBook.volume.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
