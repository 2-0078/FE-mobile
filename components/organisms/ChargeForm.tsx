'use client';

import React from 'react';
import { AmountInputSection } from '@/components/molecules/AmountInputSection';
import { QuickAmountButtons } from '@/components/molecules/QuickAmountButtons';
import { ActionButton } from '@/components/molecules/ActionButton';

interface ChargeFormProps {
  amount: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAmountSelect: (amount: number) => void;
  onCharge: () => void;
  loading: boolean;
  disabled: boolean;
  quickAmounts: number[];
}

export function ChargeForm({
  amount,
  onAmountChange,
  onAmountSelect,
  onCharge,
  loading,
  disabled,
  quickAmounts,
}: ChargeFormProps) {
  return (
    <div className="">
      <h3 className="text-lg font-semibold text-white mb-4">충전할 금액</h3>

      <AmountInputSection
        amount={amount}
        onAmountChange={onAmountChange}
        placeholder="충전할 금액을 입력하세요"
      />

      <QuickAmountButtons
        amounts={quickAmounts}
        onAmountSelect={onAmountSelect}
      />

      <ActionButton
        onClick={onCharge}
        disabled={disabled}
        loading={loading}
        loadingText="충전 중..."
        text="충전하기"
        variant="charge"
      />
    </div>
  );
}
