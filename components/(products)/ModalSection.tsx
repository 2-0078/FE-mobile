'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
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
import { PieceTradingSection } from '@/components/PieceTradingSection';
import { sortCommentsByLatest } from '@/lib/comment-utils';

export default function ModalSection({
  productData,
  itemUuid,
  type,
}: {
  productData: FundingProductType | PieceProductType;
  itemUuid: string;
  type: 'FUNDING' | 'PIECE';
}) {
  //console.log(type);
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

        // Piece 상품의 경우 실시간 시세 데이터와 전일 마지막 가격 가져오기
        if (latestData) {
          try {
            // 장 시간 체크 함수
            const isMarketOpenTime = () => {
              const now = new Date();
              const day = now.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
              const hour = now.getHours();
              const minute = now.getMinutes();
              const currentTime = hour * 100 + minute; // HHMM 형식

              // 주말 체크
              if (day === 0 || day === 6) {
                return false;
              }

              // 장 시간 체크 (09:00-15:30)
              const marketOpen = 900; // 09:00
              const marketClose = 1530; // 15:30

              return currentTime >= marketOpen && currentTime <= marketClose;
            };

            // 실시간 시세 데이터 가져오기
            const { getRealTimePrice } = await import(
              '@/action/market-price-service'
            );
            const realTimePriceResponse = await getRealTimePrice(itemUuid);

            if (
              realTimePriceResponse?.isSuccess &&
              realTimePriceResponse.result &&
              realTimePriceResponse.result.price > 0
            ) {
              // 실시간 가격으로 closingPrice 업데이트
              latestData = {
                ...latestData,
                piece: {
                  ...latestData.piece,
                  closingPrice: realTimePriceResponse.result.price,
                },
              };
            } else {
              // 실시간 데이터가 없거나 장이 닫혀있을 때 전일 마지막 가격 가져오기
              if (!latestData.piece.closingPrice || !isMarketOpenTime()) {
                const { getPreviousDayQuotes } = await import(
                  '@/action/market-price-service'
                );
                const previousDayQuotesResponse =
                  await getPreviousDayQuotes(itemUuid);

                if (
                  previousDayQuotesResponse?.isSuccess &&
                  previousDayQuotesResponse.result
                ) {
                  // 전일 마지막 가격을 계산 (매수/매도 호가의 중간값)
                  const askp = previousDayQuotesResponse.result.askp[0] || 0;
                  const bidp = previousDayQuotesResponse.result.bidp[0] || 0;
                  const previousClosingPrice =
                    askp > 0 && bidp > 0
                      ? Math.round((askp + bidp) / 2)
                      : askp || bidp;

                  if (previousClosingPrice > 0) {
                    latestData = {
                      ...latestData,
                      piece: {
                        ...latestData.piece,
                        previousClosingPrice: previousClosingPrice,
                      },
                    };
                  }
                }
              }
            }
          } catch (error) {
            console.error(
              'Failed to fetch real-time price or previous day quotes:',
              error
            );
          }
        }
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

  // 거래 완료 후 데이터 새로고침
  const handleTradingCompleted = async () => {
    await fetchLatestProductData();
    closeModal();
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
                <h1 className="text-black text-lg font-semibold">
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
                className="border-t border-gray-200 bg-white flex-shrink-0"
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
                  {/* Piece Trading Section */}
                  <PieceTradingSection
                    pieceUuid={itemUuid}
                    currentPrice={
                      (currentProductData as PieceProductType).piece
                        .closingPrice ||
                      (currentProductData as PieceProductType).piece
                        .previousClosingPrice ||
                      0
                    }
                    tradeQuantity={
                      (currentProductData as PieceProductType).piece
                        .tradeQuantity
                    }
                    onTradingCompleted={handleTradingCompleted}
                    isPreviousPrice={(() => {
                      const now = new Date();
                      const day = now.getDay();
                      const hour = now.getHours();
                      const minute = now.getMinutes();
                      const currentTime = hour * 100 + minute;

                      // 주말 체크
                      if (day === 0 || day === 6) {
                        return true;
                      }

                      // 장 시간 체크 (09:00-15:30)
                      const marketOpen = 900;
                      const marketClose = 1530;
                      const isMarketOpen =
                        currentTime >= marketOpen && currentTime <= marketClose;

                      // 장이 닫혀있으면 true
                      if (!isMarketOpen) {
                        return true;
                      }

                      // 장이 열려있으면 false (거래 가능)
                      return false;
                    })()}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </ModalContainer>
    </>
  );
}
