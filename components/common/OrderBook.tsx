'use client';
import React, { useState, useEffect } from 'react';
import TradingModal from './TradingModal';
import MarketDepthChart from './MarketDepthChart';
import OrderBookService, {
  OrderBookData,
  OrderBookItem,
} from '@/services/OrderBookService';

interface OrderBookProps {
  pieceUuid: string;
}

export default function OrderBook({ pieceUuid }: OrderBookProps) {
  const [orderBookData, setOrderBookData] = useState<OrderBookData>({
    bids: [],
    asks: [],
    lastPrice: 0,
    change: 0,
    changePercent: 0,
    spread: 0,
    volume: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [tradingModal, setTradingModal] = useState<{
    isOpen: boolean;
    type: 'buy' | 'sell';
  }>({
    isOpen: false,
    type: 'buy',
  });

  // Use OrderBookService for data fetching and real-time updates
  useEffect(() => {
    const orderBookService = OrderBookService.getInstance();

    // Initial data fetch
    const fetchData = async () => {
      try {
        const data = await orderBookService.getOrderBook(pieceUuid);
        setOrderBookData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch order book data:', error);
        setIsLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const unsubscribe = orderBookService.subscribeToUpdates(
      pieceUuid,
      (data) => {
        setOrderBookData(data);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [pieceUuid]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Price Summary */}
      <div className="bg-custom-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-custom-gray-300">현재가</div>
            <div className="text-xl font-bold text-white">
              {orderBookData.lastPrice.toLocaleString()}
              <span className="text-sm ml-1">원</span>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-sm ${orderBookData.change >= 0 ? 'text-red-500' : 'text-blue-500'}`}
            >
              {orderBookData.change >= 0 ? '+' : ''}
              {orderBookData.change.toLocaleString()}
            </div>
            <div
              className={`text-xs ${orderBookData.changePercent >= 0 ? 'text-red-500' : 'text-blue-500'}`}
            >
              {orderBookData.changePercent >= 0 ? '+' : ''}
              {orderBookData.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Order Book Table */}
      <div className="bg-custom-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-3 text-xs text-custom-gray-300 bg-custom-gray-700 px-4 py-2">
          <div>가격</div>
          <div className="text-center">수량</div>
          <div className="text-right">총액</div>
        </div>

        {/* Ask Orders (Sell Orders) */}
        <div className="space-y-1 px-4 py-2">
          {orderBookData.asks.slice(0, 5).map((ask, index) => (
            <div key={`ask-${index}`} className="grid grid-cols-3 text-sm">
              <div className="text-red-500 font-medium">
                {ask.price.toLocaleString()}
              </div>
              <div className="text-center text-white">
                {ask.quantity.toLocaleString()}
              </div>
              <div className="text-right text-custom-gray-300">
                {ask.total.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="bg-custom-gray-700 px-4 py-1 text-center">
          <span className="text-xs text-custom-gray-300">
            스프레드:{' '}
            {(
              orderBookData.asks[0]?.price - orderBookData.bids[0]?.price
            ).toLocaleString()}
            원
          </span>
        </div>

        {/* Bid Orders (Buy Orders) */}
        <div className="space-y-1 px-4 py-2">
          {orderBookData.bids.slice(0, 5).map((bid, index) => (
            <div key={`bid-${index}`} className="grid grid-cols-3 text-sm">
              <div className="text-blue-500 font-medium">
                {bid.price.toLocaleString()}
              </div>
              <div className="text-center text-white">
                {bid.quantity.toLocaleString()}
              </div>
              <div className="text-right text-custom-gray-300">
                {bid.total.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trading Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setTradingModal({ isOpen: true, type: 'sell' })}
          className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium"
        >
          매도
        </button>
        <button
          onClick={() => setTradingModal({ isOpen: true, type: 'buy' })}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
        >
          매수
        </button>
      </div>

      {/* Market Depth Chart */}
      <div className="bg-custom-gray-800 rounded-lg p-4">
        <div className="text-sm font-medium text-white mb-3">시장 깊이</div>
        <MarketDepthChart
          bids={orderBookData.bids}
          asks={orderBookData.asks}
          maxQuantity={Math.max(
            ...orderBookData.bids.map((bid) => bid.quantity),
            ...orderBookData.asks.map((ask) => ask.quantity)
          )}
        />
      </div>

      {/* Trading Modal */}
      <TradingModal
        isOpen={tradingModal.isOpen}
        onClose={() => setTradingModal({ isOpen: false, type: 'buy' })}
        type={tradingModal.type}
        currentPrice={orderBookData.lastPrice}
        pieceUuid={pieceUuid}
      />
    </div>
  );
}
