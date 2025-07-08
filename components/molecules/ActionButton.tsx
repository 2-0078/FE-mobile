'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  loadingText: string;
  text: string;
  variant: 'charge' | 'withdraw';
}

export function ActionButton({
  onClick,
  disabled,
  loading,
  loadingText,
  text,
  variant,
}: ActionButtonProps) {
  const isCharge = variant === 'charge';
  const Icon = isCharge ? Plus : Minus;
  const bgColor = isCharge
    ? 'bg-custom-green text-black'
    : 'bg-custom-light-blue text-white';
  const hoverColor = isCharge
    ? 'hover:bg-custom-green/90'
    : 'hover:bg-custom-light-blue/90';

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`w-full ${bgColor} font-semibold ${hoverColor} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
    >
      <Icon size={20} />
      {loading ? loadingText : text}
    </Button>
  );
}
