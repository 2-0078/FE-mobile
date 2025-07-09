'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FundingProductType } from '@/types/ProductTypes';
import { ReplyType } from '@/types/CommunityTypes';
import { getRepliesWithChildren } from '@/action/reply-service';
import { useModal } from '@/stores/modal-store';
import { ModalContainer } from '@/components/ModalContainer';
import { ModalHeader } from '@/components/ModalHeader';
import { CommentContent as CommentsContent } from '@/components/CommentContent';
import CommentForm from '@/components/common/CommentForm';
import { PriceInfo } from '@/components/PriceInfo';
import { AmountSection } from '@/components/AmountSection';

export default function ModalSection({
  productData,
  itemUuid,
  type,
}: {
  productData: FundingProductType;
  itemUuid: string;
  type: 'FUNDING' | 'PIECE';
}) {
  console.log(type);
  const commentPage = useSearchParams().get('commentPage') || '1';
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReplies = async () => {
      setIsLoading(true);
      try {
        const repliesData = await getRepliesWithChildren(
          type,
          itemUuid,
          commentPage
        );
        setReplies(repliesData || []);
      } catch (error) {
        console.error('Failed to fetch replies:', error);
        setReplies([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReplies();
  }, [itemUuid, commentPage, type]);

  const handleCommentSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Refresh comments after submission
      const repliesData = await getRepliesWithChildren(
        type,
        itemUuid,
        commentPage
      );
      setReplies(repliesData || []);
    } catch (error) {
      console.error('Failed to refresh comments:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <div className="px-6 pb-4">
                <h1 className="text-gray-900 text-lg font-semibold">
                  {productData.productName}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {productData.mainCategory.categoryName} &gt;
                  {productData.subCategory.categoryName}
                </p>
              </div>
            </ModalHeader>
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="px-6 py-16 text-center">
                    <div className="text-gray-300 text-2xl mb-3">⏳</div>
                    <p className="text-gray-500 text-sm font-medium">
                      댓글을 불러오는 중...
                    </p>
                  </div>
                ) : (
                  <CommentsContent comments={replies} />
                )}
              </div>
              <div className="border-t border-gray-200">
                <CommentForm
                  boardType={type}
                  boardUuid={itemUuid}
                  onCommentAdded={handleCommentSubmit}
                />
              </div>
            </div>
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
                depositBalance={120000}
                remainingPieces={productData.funding.remainingPieces}
                piecePrice={productData.funding.piecePrice}
              />
              <div className="sticky bottom-0 bg-white p-4">
                <Button className="w-full h-14 bg-custom-green text-black text-lg font-bold rounded-full">
                  매수하기
                </Button>
              </div>
            </div>
          </>
        )}
      </ModalContainer>
    </>
  );
}
