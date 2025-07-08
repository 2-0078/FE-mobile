'use client';

import React from 'react';
import { X } from 'lucide-react';
import { BalanceDisplay } from '@/components/atoms/BalanceDisplay';
import { ChargeForm } from '@/components/organisms/ChargeForm';
import { InfoSection } from '@/components/organisms/InfoSection';

interface ChargePageTemplateProps {
  balance: number;
  balanceLoading: boolean;
  amount: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAmountSelect: (amount: number) => void;
  onCharge: () => void;
  onClose: () => void;
  loading: boolean;
  disabled: boolean;
  quickAmounts: number[];
  infoItems: string[];
}

export function ChargePageTemplate({
  balance,
  balanceLoading,
  amount,
  onAmountChange,
  onAmountSelect,
  onCharge,
  onClose,
  loading,
  disabled,
  quickAmounts,
  infoItems,
}: ChargePageTemplateProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      {/* 상단 닫기 버튼 */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
        <h1 className="text-lg font-semibold text-white">충전하기</h1>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
        >
          <X size={28} />
        </button>
      </div>

      <div className="flex-1 px-4 py-6 space-y-6">
        <BalanceDisplay
          balance={balance}
          isLoading={balanceLoading}
          iconColor="text-custom-green"
        />

        <ChargeForm
          amount={amount}
          onAmountChange={onAmountChange}
          onAmountSelect={onAmountSelect}
          onCharge={onCharge}
          loading={loading}
          disabled={disabled}
          quickAmounts={quickAmounts}
        />

        <InfoSection title="안내사항" items={infoItems} />
      </div>
    </div>
  );
}
