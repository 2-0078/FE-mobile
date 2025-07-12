'use client';
import React from 'react';

interface OrderBookItem {
  price: number;
  quantity: number;
  total: number;
}

interface MarketDepthChartProps {
  bids: OrderBookItem[];
  asks: OrderBookItem[];
  maxQuantity: number;
}

export default function MarketDepthChart({
  bids,
  asks,
  maxQuantity,
}: MarketDepthChartProps) {
  const maxPrice = Math.max(...asks.map((ask) => ask.price));
  const minPrice = Math.min(...bids.map((bid) => bid.price));
  const priceRange = maxPrice - minPrice;

  const getBarWidth = (quantity: number) => {
    return (quantity / maxQuantity) * 100;
  };

  const getPricePosition = (price: number) => {
    return ((price - minPrice) / priceRange) * 100;
  };

  return (
    <div className="relative h-64 bg-custom-gray-700 rounded-lg p-4">
      {/* Price Scale */}
      <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-custom-gray-300">
        {[maxPrice, (maxPrice + minPrice) / 2, minPrice].map((price, index) => (
          <div key={index} className="text-right pr-2">
            {price.toLocaleString()}
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="ml-16 h-full relative">
        {/* Ask Orders (Red bars on the right) */}
        <div className="absolute top-0 right-0 bottom-0 w-1/2">
          {asks.map((ask, index) => (
            <div
              key={`ask-${index}`}
              className="absolute bg-red-500 bg-opacity-60"
              style={{
                top: `${getPricePosition(ask.price)}%`,
                right: '0',
                width: `${getBarWidth(ask.quantity)}%`,
                height: '2px',
              }}
            />
          ))}
        </div>

        {/* Bid Orders (Blue bars on the left) */}
        <div className="absolute top-0 left-0 bottom-0 w-1/2">
          {bids.map((bid, index) => (
            <div
              key={`bid-${index}`}
              className="absolute bg-blue-500 bg-opacity-60"
              style={{
                top: `${getPricePosition(bid.price)}%`,
                left: '0',
                width: `${getBarWidth(bid.quantity)}%`,
                height: '2px',
              }}
            />
          ))}
        </div>

        {/* Center Line */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-custom-gray-500" />
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 left-16 right-4 flex justify-between text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 bg-opacity-60 mr-1" />
          <span className="text-custom-gray-300">매도</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 bg-opacity-60 mr-1" />
          <span className="text-custom-gray-300">매수</span>
        </div>
      </div>
    </div>
  );
}
