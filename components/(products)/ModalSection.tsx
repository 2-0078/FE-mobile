'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FundingProductType, PieceProductType } from '@/types/ProductTypes';
import { ReplyType } from '@/types/CommunityTypes';
import {
  getRepliesWithChildren,
  revalidateRepliesCache,
} from '@/action/reply-service';
import { getFundingProduct, getPieceProducts } from '@/action/product-service';
import { useModal } from '@/stores/modal-store';
import { ModalContainer } from '@/components/ModalContainer';
import { ModalHeader } from '@/components/ModalHeader';
import { CommentContent as CommentsContent } from '@/components/CommentContent';
import CommentForm from '@/components/common/CommentForm';
import { PriceInfo } from '@/components/PriceInfo';
import { AmountSection } from '@/components/AmountSection';
import { sortCommentsByLatest } from '@/lib/comment-utils';
import Image from 'next/image';
import InfoCardLayout from '@/components/layout/InfoCardLayout';
import TempPriceIcon from '@/repo/ui/Icons/TempPriceIcon';
import ClockIcon from '@/repo/ui/Icons/ClockIcon';

export default function ModalSection({
  productData,
  itemUuid,
  type,
}: {
  productData: FundingProductType | PieceProductType;
  itemUuid: string;
  type: 'FUNDING' | 'PIECE';
}) {
  console.log(type);
  const commentPage = useSearchParams().get('commentPage') || '1';
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [currentProductData, setCurrentProductData] = useState(productData);

  const { currentModal, closeModal } = useModal();

  // 실시간 데이터 가져오기
  const fetchLatestProductData = async () => {
    try {
      let latestData;
      if (type === 'FUNDING') {
        latestData = await getFundingProduct(itemUuid);
      } else {
        latestData = await getPieceProducts(itemUuid);
      }
      setCurrentProductData(latestData);
    } catch (error) {
      console.error('Failed to fetch latest product data:', error);
      // 에러 발생 시 기존 데이터 유지
    }
  };

  const fetchReplies = async () => {
    setIsLoading(true);
    try {
      // 모달이 열릴 때 캐시를 무효화하여 최신 데이터를 가져옴
      await revalidateRepliesCache({
        boardType: type,
        boardUuid: itemUuid,
      });

      const repliesData = await getRepliesWithChildren(
        type,
        itemUuid,
        commentPage
      );

      // 댓글을 최신순으로 정렬
      const sortedReplies = sortCommentsByLatest(repliesData || []);
      setReplies(sortedReplies);
    } catch (error) {
      console.error('Failed to fetch replies:', error);
      setReplies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 댓글 모달이 열릴 때마다 데이터를 새로 가져옴
    if (currentModal === 'comments') {
      startTransition(() => {
        fetchReplies();
      });
    }
  }, [currentModal, itemUuid, commentPage, type]);

  // details 모달이 열릴 때마다 최신 데이터 가져오기
  useEffect(() => {
    if (currentModal === 'details') {
      fetchLatestProductData();
    }
  }, [currentModal, itemUuid, type]);

  // commentUpdated 이벤트 처리
  useEffect(() => {
    const handleCommentUpdated = async () => {
      if (currentModal === 'comments') {
        startTransition(async () => {
          try {
            setIsLoading(true);
            const repliesData = await getRepliesWithChildren(
              type,
              itemUuid,
              commentPage
            );
            const sortedReplies = sortCommentsByLatest(repliesData || []);
            setReplies(sortedReplies);
          } catch (error) {
            console.error('Failed to refresh comments:', error);
          } finally {
            setIsLoading(false);
          }
        });
      }
    };

    window.addEventListener('commentUpdated', handleCommentUpdated);
    return () => {
      window.removeEventListener('commentUpdated', handleCommentUpdated);
    };
  }, [currentModal, type, itemUuid, commentPage]);

  const handleCommentSubmit = async () => {
    startTransition(async () => {
      try {
        // Refresh comments after submission
        const repliesData = await getRepliesWithChildren(
          type,
          itemUuid,
          commentPage
        );

        // 댓글을 최신순으로 정렬
        const sortedReplies = sortCommentsByLatest(repliesData || []);
        setReplies(sortedReplies);
      } catch (error) {
        console.error('Failed to refresh comments:', error);
      }
    });
  };

  return (
    <>
      <ModalContainer
        isOpen={currentModal === 'comments'}
        onClose={() => closeModal()}
      >
        {() => (
          <>
            <ModalHeader>
              <div className="px-6 pb-4">
                <h1 className="text-white text-lg font-semibold">
                  {currentProductData.productName}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {currentProductData.mainCategory.categoryName} &gt;
                  {currentProductData.subCategory.categoryName}
                </p>
              </div>
            </ModalHeader>
            <div className="flex flex-col h-full">
              <div className="overflow-y-auto px-6" style={{ height: '70%' }}>
                {isLoading || isPending ? (
                  <div className="py-16 text-center">
                    <div className="text-gray-400 text-2xl mb-3">⏳</div>
                    <p className="text-gray-500 text-sm font-medium">
                      댓글을 불러오는 중...
                    </p>
                  </div>
                ) : (
                  <CommentsContent
                    comments={replies}
                    boardType={type}
                    boardUuid={itemUuid}
                  />
                )}
              </div>

              <div
                className="border-t border-gray-700 bg-gray-900 flex-shrink-0"
                style={{ height: '40%' }}
              >
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
        {() => (
          <>
            <ModalHeader />
            <div className="space-y-4 px-6">
              {type === 'FUNDING' ? (
                // Funding 상세 모달
                <>
                  <PriceInfo
                    currentPrice={
                      (currentProductData as FundingProductType).funding
                        .piecePrice
                    }
                    totalPieces={
                      (currentProductData as FundingProductType).funding
                        .totalPieces
                    }
                    remainingPieces={
                      (currentProductData as FundingProductType).funding
                        .remainingPieces
                    }
                  />
                  <AmountSection
                    remainingPieces={
                      (currentProductData as FundingProductType).funding
                        .remainingPieces
                    }
                    piecePrice={
                      (currentProductData as FundingProductType).funding
                        .piecePrice
                    }
                    fundingUuid={
                      (currentProductData as FundingProductType).funding
                        .fundingUuid
                    }
                    productUuid={currentProductData.productUuid}
                    onFundingParticipated={fetchLatestProductData}
                  />
                </>
              ) : (
                // Piece 매수/매도 모달
                <div className="space-y-6">
                  {/* 작품 이미지 및 제목 */}
                  <div className="relative">
                    <Image
                      src={
                        (currentProductData as PieceProductType).images[0]
                          ?.imageUrl || '/example.png'
                      }
                      alt={(currentProductData as PieceProductType).productName}
                      width={400}
                      height={256}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h2 className="text-white text-lg font-semibold">
                        {(currentProductData as PieceProductType).productName}
                      </h2>
                    </div>
                  </div>

                  {/* 가격 및 거래량 정보 */}
                  <div className="flex justify-around gap-x-3">
                    <InfoCardLayout
                      className="h-12 border-gray-600 border-1"
                      title="현재가"
                      icon={<TempPriceIcon />}
                    >
                      <span className="text-base font-semibold text-white leading-none">
                        {(
                          currentProductData as PieceProductType
                        ).piece.closingPrice?.toLocaleString() || '0'}
                      </span>
                    </InfoCardLayout>
                    <InfoCardLayout
                      className="h-12 border-gray-600 border-1"
                      title="거래량"
                      icon={<ClockIcon />}
                    >
                      <span className="text-base font-semibold text-white leading-none">
                        {
                          (currentProductData as PieceProductType).piece
                            .tradeQuantity
                        }
                      </span>
                    </InfoCardLayout>
                  </div>

                  {/* TODO: 사용자의 piece 보유 현황에 따라 매수/매도 구분 */}
                  {/* 보유하지 않은 경우: 매수 */}
                  {/* 보유한 경우: 매도 (보유 수량 표시) */}

                  {/* 매수/매도 수량 입력 */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      매수 수량
                    </h3>
                    <input
                      type="number"
                      placeholder="매수할 수량을 입력하세요"
                      className="w-full text-center text-white text-2xl font-bold border-b border-gray-600 pb-2 h-12 bg-transparent focus:outline-none focus:border-custom-green placeholder-gray-400"
                      min="1"
                    />
                  </div>

                  <Button className="w-full h-14 bg-custom-green text-black text-lg font-bold rounded-full">
                    매수하기
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </ModalContainer>
    </>
  );
}
