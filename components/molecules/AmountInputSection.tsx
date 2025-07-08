'use client';

import React from 'react';
import { AmountInput } from '@/components/atoms/AmountInput';

interface AmountInputSectionProps {
  amount: string;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export function AmountInputSection({
  amount,
  onAmountChange,
  placeholder,
}: AmountInputSectionProps) {
  return (
    <div className="mb-6">
      <AmountInput
        value={amount}
        onChange={onAmountChange}
        placeholder={placeholder}
      />
      {amount && (
        <p className="text-right text-gray-400 mt-2">
          {parseInt(amount).toLocaleString()}원
        </p>
      )}
    </div>
  );
}
