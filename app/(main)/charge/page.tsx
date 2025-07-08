'use client';

import React from 'react';
import { ChargePageTemplate } from '@/components/templates/ChargePageTemplate';
import { useCharge } from '@/hooks/useCharge';
import { CHARGE_CONSTANTS } from '@/constants/charge';

export default function ChargePage() {
  const {
    amount,
    balance,
    balanceLoading,
    loading,
    isDisabled,
    handleAmountChange,
    handleAmountSelect,
    handleCharge,
    handleClose,
  } = useCharge();

  return (
    <ChargePageTemplate
      balance={balance}
      balanceLoading={balanceLoading}
      amount={amount}
      onAmountChange={handleAmountChange}
      onAmountSelect={handleAmountSelect}
      onCharge={handleCharge}
      onClose={handleClose}
      loading={loading}
      disabled={isDisabled}
      quickAmounts={[...CHARGE_CONSTANTS.QUICK_AMOUNTS]}
      infoItems={[...CHARGE_CONSTANTS.INFO_ITEMS]}
    />
  );
}
