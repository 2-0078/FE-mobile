'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getMemberBalance } from '@/action/payment-service';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Wallet } from 'lucide-react';
import { ResponsiveAmount } from '@/components/atoms/ResponsiveAmount';
import { AmountSkeleton, ButtonSkeleton } from '@/components/atoms';

export default function AmmountCard({ user }: { user: boolean }) {
  const [balance, setBalance] = useState<{ amount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBalance = async () => {
      try {
        const balanceData = await getMemberBalance();
        setBalance(balanceData);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance({ amount: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [user]);

  const handleCharge = () => {
    // 충전하기 페이지로 이동
    router.push('/charge');
  };

  const handleWithdraw = () => {
    // 출금하기 페이지로 이동
    router.push('/withdraw');
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-dark-blue rounded-2xl py-6 px-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <Wallet className="w-6 h-6 text-custom-green mr-2" />
            <p className="text-gray-400">현재 잔액</p>
          </div>
          <AmountSkeleton className="mb-1" />
        </div>

        <div className="flex justify-center items-center gap-3 w-full">
          <ButtonSkeleton />
          <ButtonSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-blue rounded-2xl py-6 px-4">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Wallet className="w-6 h-6 text-custom-green mr-2" />
          <p className="text-gray-400">현재 잔액</p>
        </div>
        <ResponsiveAmount amount={balance?.amount || 0} className="mb-1" />
      </div>

      <div className="flex justify-center items-center gap-3 w-full">
        <Button
          onClick={handleCharge}
          className="bg-custom-green text-black font-semibold hover:bg-custom-green/90 flex items-center justify-center gap-2 w-fit"
        >
          <Plus size={18} />
          충전하기
        </Button>
        <Button
          onClick={handleWithdraw}
          className="bg-custom-light-blue text-white font-semibold hover:bg-custom-light-blue/90 flex items-center justify-center gap-2 w-fit"
        >
          <Minus size={18} />
          출금하기
        </Button>
      </div>
    </div>
  );
}
