'use client';

import React, { useState, useEffect } from 'react';

interface OrderBookData {
  price: number;
  quantity: number;
  total: number;
}

interface OrderBookProps {
  pieceUuid: string;
}

export default function OrderBook({ pieceUuid }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<{
    asks: OrderBookData[];
    bids: OrderBookData[];
  }>({
    asks: [],
    bids: [],
  });

  // 임시 데이터 (실제로는 API에서 가져와야 함)
  useEffect(() => {
    const mockData = {
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
    };
    setOrderBook(mockData);
  }, [pieceUuid]);

  const maxTotal = Math.max(
    ...orderBook.asks.map((ask) => ask.total),
    ...orderBook.bids.map((bid) => bid.total)
  );

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-base font-semibold text-white mb-3">호가창</h3>

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

      {/* 스프레드 정보 */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">스프레드</span>
          <span className="text-xs font-medium text-white">
            {orderBook.asks.length > 0 && orderBook.bids.length > 0
              ? (
                  orderBook.asks[0].price - orderBook.bids[0].price
                ).toLocaleString()
              : 0}
            원
          </span>
        </div>
      </div>
    </div>
  );
}
