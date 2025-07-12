'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createPayment } from '@/action/payment-service';
import { useAlert } from '@/hooks/useAlert';

export function ChargeForm() {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { error: showError } = useAlert();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 숫자만 입력 가능
    if (!/^\d*$/.test(value)) {
      return;
    }

    setAmount(value);
  };

  const handleCharge = async () => {
    if (!amount || Number(amount) === 0) {
      showError('충전할 금액을 입력해주세요.');
      return;
    }

    if (Number(amount) < 1000) {
      showError('최소 충전 금액은 1,000원입니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 결제 생성 API 호출
      const paymentResponse = await createPayment({
        amount: Number(amount),
        orderName: `예치금 충전 ${Number(amount).toLocaleString()}원`,
      });

      if (!paymentResponse.isSuccess) {
        throw new Error(paymentResponse.message || '결제 생성에 실패했습니다.');
      }

      const { paymentUrl } = paymentResponse.result;

      // 백엔드에서 제공하는 결제 URL로 리다이렉트
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error(
          '결제 URL을 받지 못했습니다. 백엔드에서 paymentUrl을 제공해야 합니다.'
        );
      }
    } catch (err) {
      console.error('Payment failed:', err);
      if (err instanceof Error) {
        showError(err.message);
      } else {
        showError('결제 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [10000, 50000, 100000, 200000, 500000];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">충전 금액</h2>

        <div className="mb-4">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="충전할 금액을 입력하세요"
            className="w-full text-center text-black text-2xl font-bold border-b border-gray-300 pb-2 h-12 bg-transparent focus:outline-none focus:border-custom-green"
            min="1000"
          />
          <div className="text-right text-gray-400 text-sm mt-1">
            최소 1,000원
          </div>
        </div>

        {/* 빠른 금액 선택 버튼들 */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {quickAmounts.map((quickAmount) => (
            <Button
              key={quickAmount}
              variant="outline"
              onClick={() => setAmount(quickAmount.toString())}
              className="text-sm"
            >
              {quickAmount.toLocaleString()}원
            </Button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleCharge}
        disabled={isLoading || !amount || Number(amount) === 0}
        className="w-full h-14 bg-custom-green text-black text-lg font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading
          ? '처리중...'
          : `${Number(amount || 0).toLocaleString()}원 충전하기`}
      </Button>
    </div>
  );
}
