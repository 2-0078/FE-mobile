'use client';
import React from 'react';
import { ModalContainer } from '../ModalContainer';
import { ModalHeader } from '../ModalHeader';
import { CommentsContent } from '../CommentContent';
import { AmountSection } from '../AmountSection';
import { useModal } from '@/stores/modal-store';
import { PriceInfo } from '../PriceInfo';
import { ReplyTypeWithPeople } from '@/types/CommunityTypes';
import { FundingProductType } from '@/types/ProductTypes';

export default function ModalSection({
  productData,
  itemUuid,
  replyList,
}: {
  productData: FundingProductType;
  itemUuid: string;
  replyList: ReplyTypeWithPeople[];
}) {
  const { currentModal, closeModal } = useModal();
  return (
    <>
      <ModalContainer
        isOpen={currentModal === 'comments'}
        onClose={() => closeModal()}
      >
        {(handleClose: () => void) => (
          <>
            <ModalHeader onClose={handleClose}>
              <div className="px-6 pb-6">
                <h1 className="text-black text-lg font-bold">
                  {productData.productName}
                </h1>
                <p className="text-black text-sm">
                  {productData.mainCategory.categoryName} &gt;
                  {productData.subCategory.categoryName}
                </p>
              </div>
            </ModalHeader>
            <CommentsContent comments={replyList} />
          </>
        )}
      </ModalContainer>

      <ModalContainer
        isOpen={currentModal === 'details'}
        onClose={() => closeModal()}
      >
        {(handleClose: () => void) => (
          <>
            <ModalHeader onClose={handleClose} />
            <div className="space-y-4 px-6">
              <PriceInfo
                currentPrice={productData.funding.piecePrice}
                totalPieces={productData.funding.totalPieces}
                remainingPieces={productData.funding.remainingPieces}
              />
              <AmountSection
                remainingPieces={productData.funding.remainingPieces}
                piecePrice={productData.funding.piecePrice}
                itemUuid={itemUuid}
              />
            </div>
          </>
        )}
      </ModalContainer>
    </>
  );
}
