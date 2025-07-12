'use client';
import React, { useState, useEffect } from 'react';
import OrderBookService, { TradingOrder } from '@/services/OrderBookService';

interface OrderHistoryProps {
  pieceUuid: string;
}

export default function OrderHistory({ pieceUuid }: OrderHistoryProps) {
  const [orders, setOrders] = useState<TradingOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const orderBookService = OrderBookService.getInstance();
        const history = await orderBookService.getOrderHistory(pieceUuid);
        setOrders(history);
      } catch (error) {
        console.error('Failed to fetch order history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, [pieceUuid]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-custom-gray-400 text-sm">
          거래 내역이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-custom-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 text-xs text-custom-gray-300 bg-custom-gray-700 px-4 py-2">
          <div>유형</div>
          <div>가격</div>
          <div>수량</div>
          <div>총액</div>
          <div>시간</div>
        </div>

        <div className="space-y-1">
          {orders.map((order, index) => (
            <div
              key={index}
              className="grid grid-cols-5 text-sm px-4 py-2 hover:bg-custom-gray-700"
            >
              <div
                className={`font-medium ${
                  order.type === 'buy' ? 'text-blue-500' : 'text-red-500'
                }`}
              >
                {order.type === 'buy' ? '매수' : '매도'}
              </div>
              <div className="text-white">{order.price.toLocaleString()}원</div>
              <div className="text-white">
                {order.quantity.toLocaleString()}
              </div>
              <div className="text-custom-gray-300">
                {order.totalAmount.toLocaleString()}원
              </div>
              <div className="text-custom-gray-300 text-xs">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-custom-gray-800 rounded-lg p-4">
        <div className="text-sm font-medium text-white mb-3">거래 요약</div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-custom-gray-300">총 거래량</div>
            <div className="text-white font-medium">
              {orders
                .reduce((sum, order) => sum + order.quantity, 0)
                .toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-custom-gray-300">총 거래금액</div>
            <div className="text-white font-medium">
              {orders
                .reduce((sum, order) => sum + order.totalAmount, 0)
                .toLocaleString()}
              원
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
