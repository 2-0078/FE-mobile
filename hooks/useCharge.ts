'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/hooks/useAlert';
import { chargeMoney, getMemberBalance } from '@/action/payment-service';

export function useCharge() {
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

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  const handleCharge = async () => {
    if (!amount || parseInt(amount) === 0) {
      showError('충전할 금액을 입력해주세요.');
      return;
    }

    if (parseInt(amount) < 10000) {
      showError('최소 충전 금액은 10,000원입니다.');
      return;
    }

    if (parseInt(amount) > 1000000) {
      showError('최대 충전 금액은 1,000,000원입니다.');
      return;
    }

    setLoading(true);
    try {
      await chargeMoney(parseInt(amount));
      success(`${parseInt(amount).toLocaleString()}원이 충전되었습니다.`);

      // 잔액 새로고침
      const newBalanceData = await getMemberBalance();
      setBalance(newBalanceData?.amount || 0);

      // 입력값 초기화
      setAmount('');

      // 잠시 후 이전 페이지로 이동
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('충전 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const isDisabled = loading || !amount || parseInt(amount) === 0;

  return {
    amount,
    balance,
    balanceLoading,
    loading,
    isDisabled,
    handleAmountChange,
    handleAmountSelect,
    handleCharge,
    handleClose,
  };
}
