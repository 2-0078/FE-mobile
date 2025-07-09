'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import ModalSection from '../(products)/ModalSection';
import { BottomActions } from '../BottomActions';
import { FundingProductType } from '@/types/ProductTypes';

interface FundingDetailClientProps {
  fundingUuid: string;
  productUuid: string;
  children: React.ReactNode;
  productData: FundingProductType;
}

export default function FundingDetailClient({
  fundingUuid,
  productUuid,
  children,
  productData,
}: FundingDetailClientProps) {
  return (
    <>
      <Header isCloseButton={true} />

      {children}
      <BottomActions fundingUuid={fundingUuid} productUuid={productUuid} />
      <ModalSection
        productData={productData}
        itemUuid={fundingUuid}
        type="FUNDING"
      />
    </>
  );
}
