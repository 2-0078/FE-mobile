'use client';

import React, { useEffect, useState } from 'react';
import { getFundingWish } from '@/action/funding-service';
import Header from '@/components/layout/Header';
import WishButton from './WishButton';
import ModalSection from '../(products)/ModalSection';
import { BottomActions } from '../BottomActions';
import { ProductType } from '@/types/ProductTypes';

interface FundingDetailClientProps {
  fundingUuid: string;
  productUuid: string;
  children: React.ReactNode;
  productData: ProductType;
}

export default function FundingDetailClient({
  fundingUuid,
  productUuid,
  children,
  productData,
}: FundingDetailClientProps) {
  const [isWished, setIsWished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishStatus = async () => {
      try {
        const wishStatus = await getFundingWish(fundingUuid);
        setIsWished(Boolean(wishStatus));
      } catch (error) {
        console.error('Failed to fetch wish status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishStatus();
  }, [fundingUuid]);

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
