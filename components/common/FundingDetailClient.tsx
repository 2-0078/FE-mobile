'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import ModalSection from '../(products)/ModalSection';
import { BottomActions } from '../BottomActions';
import { FundingProductType } from '@/types/ProductTypes';
import { useModal } from '@/stores/modal-store';

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
  const searchParams = useSearchParams();
  const { openModal } = useModal();

  // openComments 파라미터 감지하여 댓글 모달 자동 열기
  useEffect(() => {
    const openComments = searchParams.get('openComments');
    if (openComments === 'true') {
      openModal('comments');
    }
  }, [searchParams, openModal]);

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
