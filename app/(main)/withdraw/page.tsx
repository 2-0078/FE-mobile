'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/hooks/useAlert';
import { X, Minus, Wallet } from 'lucide-react';
import { getMemberBalance } from '@/action/payment-service';

export default function WithdrawPage() {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const router = useRouter();
  const { success, error: showError } = useAlert();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balanceData = await getMemberBalance();
        setBalance(balanceData?.amount || 0);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance(0);
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const handleWithdraw = async () => {
    if (!amount || parseInt(amount) === 0) {
      showError('출금할 금액을 입력해주세요.');
      return;
    }

    if (parseInt(amount) < 10000) {
      showError('최소 출금 금액은 10,000원입니다.');
      return;
    }

    if (parseInt(amount) > balance) {
      showError('출금 금액이 잔액을 초과합니다.');
      return;
    }

    setLoading(true);
    try {
      // TODO: 실제 출금 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 임시 딜레이
      success(`${parseInt(amount).toLocaleString()}원이 출금되었습니다.`);

      // 잔액 새로고침
      const newBalanceData = await getMemberBalance();
      setBalance(newBalanceData?.amount || 0);

      // 입력값 초기화
      setAmount('');

      // 잠시 후 mywallet으로 이동
      setTimeout(() => {
        router.push('/mywallet');
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('출금 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [10000, 50000, 100000, 200000, 500000];

  const handleClose = () => {
    router.push('/mywallet');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      {/* 상단 닫기 버튼 */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
        <div />
        <h1 className="text-lg font-semibold text-white">출금하기</h1>
        <button
          onClick={handleClose}
          aria-label="닫기"
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
        >
          <X size={28} />
        </button>
      </div>

      <div className="flex-1 px-4 py-6 space-y-6">
        {/* 잔액 표시 */}
        <div className="bg-dark-blue rounded-2xl p-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Wallet className="w-6 h-6 text-custom-light-blue mr-2" />
              <p className="text-gray-400">현재 잔액</p>
            </div>
            <h2 className="text-3xl font-bold text-white">
              {balanceLoading ? '로딩 중...' : `${balance.toLocaleString()}원`}
            </h2>
          </div>
        </div>

        {/* 출금 금액 입력 */}
        <div className="bg-dark-blue rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">출금할 금액</h3>

          <div className="mb-6">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="출금할 금액을 입력하세요"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-custom-light-blue"
            />
            {amount && (
              <p className="text-right text-gray-400 mt-2">
                {parseInt(amount).toLocaleString()}원
              </p>
            )}
          </div>

          {/* 빠른 선택 금액 */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {quickAmounts.map((quickAmount) => (
              <Button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
                disabled={quickAmount > balance}
              >
                {quickAmount.toLocaleString()}원
              </Button>
            ))}
          </div>

          {/* 출금하기 버튼 */}
          <Button
            onClick={handleWithdraw}
            disabled={
              loading ||
              !amount ||
              parseInt(amount) === 0 ||
              parseInt(amount) > balance
            }
            className="w-full bg-custom-light-blue text-white font-semibold hover:bg-custom-light-blue/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Minus size={20} />
            {loading ? '출금 중...' : '출금하기'}
          </Button>
        </div>

        {/* 안내사항 */}
        <div className="bg-dark-blue rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">안내사항</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• 최소 출금 금액: 10,000원</li>
            <li>• 출금 금액은 잔액을 초과할 수 없습니다</li>
            <li>• 출금 처리에는 1-2일이 소요됩니다</li>
            <li>• 출금 수수료는 없습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
