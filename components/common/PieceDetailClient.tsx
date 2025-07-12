'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import ModalSection from '../(products)/ModalSection';
import { PieceBottomActions } from '../PieceBottomActions';
import { PieceProductType } from '@/types/ProductTypes';
import { useModal } from '@/stores/modal-store';

interface PieceDetailClientProps {
  pieceUuid: string;
  productUuid: string;
  children: React.ReactNode;
  productData: PieceProductType;
}

export default function PieceDetailClient({
  pieceUuid,
  productUuid,
  children,
  productData,
}: PieceDetailClientProps) {
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
    <div className="bg-white">
      <Header
        isCloseButton={true}
        className="bg-none backdrop:blur-none bg-transparent"
      />

      {children}
      <PieceBottomActions pieceUuid={pieceUuid} productUuid={productUuid} />
      <ModalSection
        productData={productData}
        itemUuid={pieceUuid}
        type="PIECE"
      />
    </div>
  );
}
