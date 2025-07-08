'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickAmountButtonsProps {
  amounts: number[];
  onAmountSelect: (amount: number) => void;
  disabled?: (amount: number) => boolean;
}

export function QuickAmountButtons({
  amounts,
  onAmountSelect,
  disabled,
}: QuickAmountButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-6">
      {amounts.map((amount) => (
        <Button
          key={amount}
          onClick={() => onAmountSelect(amount)}
          variant="outline"
          className="border-slate-600 text-white hover:bg-slate-700"
          disabled={disabled ? disabled(amount) : false}
        >
          {amount.toLocaleString()}원
        </Button>
      ))}
    </div>
  );
}
