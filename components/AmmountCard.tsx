'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getMemberBalance } from '@/action/payment-service';

export default function AmmountCard() {
  const [balance, setBalance] = useState<{ amount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-2xl p-6">
        <div className="text-center mb-6">
          <p className="text-gray-400 mb-2">현재 잔액</p>
          <h2 className="text-3xl font-bold mb-1">로딩 중...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6">
      <div className="text-center mb-6">
        <p className="text-gray-400 mb-2">현재 잔액</p>
        <h2 className="text-3xl font-bold mb-1">
          {balance?.amount.toLocaleString() || '0'}원
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button className="bg-custom-light-blue">출금하기</Button>
      </div>
    </div>
  );
}
