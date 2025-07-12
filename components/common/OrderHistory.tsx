'use client';

import React, { useState, useEffect } from 'react';

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

  // 임시 데이터 (실제로는 API에서 가져와야 함)
  useEffect(() => {
    const mockData: TradeData[] = [
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
    setTrades(mockData);
  }, [pieceUuid]);

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h3 className="text-base font-semibold text-white mb-3">체결 내역</h3>

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
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs text-gray-500">총 거래량</div>
            <div className="text-xs font-medium text-gray-900">
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
