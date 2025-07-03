'use client';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { getMemberBalance } from '@/action/payment-service';
import { useModal } from '@/stores/modal-store';

export default function AmmountCard() {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getMemberBalance();
      setBalance(balance.amount);
    };
    fetchBalance();
  }, []);
  const { openModal } = useModal();

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6">
      <div className="text-center mb-6">
        <p className="text-gray-400 mb-2">현재 잔액</p>
        <h2 className="text-3xl font-bold mb-1">
          {balance.toLocaleString()}원
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          className=" bg-custom-light-blue"
          onClick={() => openModal('purchase')}
        >
          충전하기
        </Button>
        <Button className="bg-custom-light-blue">출금하기</Button>
      </div>
    </div>
  );
}
