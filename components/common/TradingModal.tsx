'use client';
import React, { useState } from 'react';
import OrderBookService, { TradingOrder } from '@/services/OrderBookService';

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'buy' | 'sell';
  currentPrice: number;
  pieceUuid: string;
}

export default function TradingModal({
  isOpen,
  onClose,
  type,
  currentPrice,
  pieceUuid,
}: TradingModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(currentPrice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalAmount = quantity * price;
  const buttonColor =
    type === 'buy'
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-red-600 hover:bg-red-700';

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const orderBookService = OrderBookService.getInstance();

      const order: TradingOrder = {
        pieceUuid,
        type,
        price,
        quantity,
        totalAmount,
      };

      const result = await orderBookService.placeOrder(order);

      if (result.success) {
        alert(result.message);
        onClose();
      } else {
        alert(result.message || '주문 처리 중 오류가 발생했습니다.');
      }
    } catch {
      alert('주문 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-custom-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {type === 'buy' ? '매수' : '매도'}
          </h2>
          <button
            onClick={onClose}
            className="text-custom-gray-300 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Current Price */}
          <div className="bg-custom-gray-700 rounded-lg p-3">
            <div className="text-sm text-custom-gray-300">현재가</div>
            <div className="text-lg font-bold text-white">
              {currentPrice.toLocaleString()}원
            </div>
          </div>

          {/* Price Input */}
          <div>
            <label className="block text-sm text-custom-gray-300 mb-2">
              가격 (원)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full bg-custom-gray-700 text-white px-3 py-2 rounded-lg border border-custom-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="가격을 입력하세요"
            />
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm text-custom-gray-300 mb-2">
              수량
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-custom-gray-700 text-white px-3 py-2 rounded-lg border border-custom-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="수량을 입력하세요"
              min="1"
            />
          </div>

          {/* Quick Quantity Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 5, 10, 20].map((num) => (
              <button
                key={num}
                onClick={() => setQuantity(num)}
                className={`py-2 px-3 rounded text-sm ${
                  quantity === num
                    ? 'bg-blue-600 text-white'
                    : 'bg-custom-gray-700 text-custom-gray-300 hover:bg-custom-gray-600'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Total Amount */}
          <div className="bg-custom-gray-700 rounded-lg p-3">
            <div className="text-sm text-custom-gray-300">총 금액</div>
            <div className="text-lg font-bold text-white">
              {totalAmount.toLocaleString()}원
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-custom-gray-700 text-white rounded-lg hover:bg-custom-gray-600"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 text-white rounded-lg font-medium ${buttonColor} disabled:opacity-50`}
            >
              {isSubmitting ? '처리중...' : type === 'buy' ? '매수' : '매도'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
