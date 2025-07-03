'use client';

<<<<<<< HEAD
import { useState } from "react";
import { NumberPad } from "./NumberPad";
import { Button } from "@/components/ui/button";
=======
import { useEffect, useState } from 'react';
import { NumberPad } from './NumberPad';
import { Button } from '@/components/ui/button';
import { useModal } from '@/stores/modal-store';
import { getMemberBalance } from '@/action/payment-service';
import { fundingParticipate } from '@/action/funding-service';
>>>>>>> feat/productsPage

export function AmountSection({
  piecePrice,
  remainingPieces,
  depositBalance,
}: {
  piecePrice: number;
  remainingPieces: number;
  depositBalance: number;
}) {
<<<<<<< HEAD
  const [amount, setAmount] = useState("");

=======
  const [depositBalance, setDepositBalance] = useState(0);
  useEffect(() => {
    const fetchDepositBalance = async () => {
      const balance = await getMemberBalance();
      setDepositBalance(balance.amount);
    };
    fetchDepositBalance();
  }, []);
  const [amount, setAmount] = useState('');
  const { openModal } = useModal();
>>>>>>> feat/productsPage
  const handleNumberClick = (num: string) => {
    // 최대 자릿수 제한 (예: 10자리)
    if (amount.length >= 10) return;
    if (Number(amount + num) === 0) {
      setAmount(num);
      return;
    }
    if (Number(amount + num) * piecePrice > depositBalance) {
      return;
    }
    if (Number(amount + num) > remainingPieces) {
      setAmount(remainingPieces.toString());
      return;
    }
    if (Number(amount) === 0) {
      setAmount(num);
      return;
    }
    setAmount((prev) => prev + num);
  };

  const handleDelete = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmount('');
  };

  return (
    <>
      <div>
        <p className="flex items-center justify-between mb-2">
          <span className="text-gray-600 text-sm">예치금 잔액</span>
          <span className="text-custom-green text-2xl font-bold">
            {depositBalance.toLocaleString()}원
          </span>
        </p>
<<<<<<< HEAD
        <Button className="w-full h-10 bg-black text-white rounded-full">
=======
        <Button
          className="w-full h-10 bg-black text-white rounded-full"
          onClick={() => {
            openModal('purchase');
          }}
        >
>>>>>>> feat/productsPage
          예치금이 부족하신가요?
        </Button>
      </div>

      <div className="text-center">
        <p className="text-gray-600 text-xs">매수 총액</p>
        <p className="text-black text-3xl font-semibold mb-4">
          {(Number(amount) * piecePrice).toLocaleString()}원
        </p>
      </div>
      <div className="px-6 mb-6">
        <div className="mb-4">
          <div className="text-gray-600 text-xs mb-1">구매 수량</div>
          <div className="flex items-center justify-between border-b border-gray-300 pb-2 h-10">
            <span className="text-black text-2xl font-bold">{amount}</span>
            <span className="text-custom-gray-200 text-md">개</span>
          </div>
        </div>
      </div>
      <NumberPad
        onNumberClick={handleNumberClick}
        onDelete={handleDelete}
        onClear={handleClear}
      />
    </>
  );
}
