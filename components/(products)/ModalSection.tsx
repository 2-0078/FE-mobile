"use client";
import React from "react";
import { ModalContainer } from "../ModalContainer";
import { ModalHeader } from "../ModalHeader";
import { CommentsContent } from "../CommentContent";
import { AmountSection } from "../AmountSection";
import { useModal } from "@/stores/modal-store";
import { Button } from "../ui/button";
import { BalanceInfo } from "../BalanceInfo";
import { PriceInfo } from "../PriceInfo";

interface ProductData {
  koreanTitle: string;
  englishTitle: string;
  imageUrl: string;
  remainingPieces: number;
  totalPieces: number;
  currentPrice: number;
  endDateTime: string;
}

const productData: ProductData = {
  koreanTitle: "샤넬 클래식 플랩 백 미디움 블랙 은장",
  englishTitle: "Chanel Classic Flap Bag Medium Caviar Black A01112",
  imageUrl: "/placeholder.svg?height=300&width=400",
  remainingPieces: 258,
  totalPieces: 1000,
  currentPrice: 2000000,
  // 고정된 미래 날짜 사용 (예: 2025년 7월 1일)
  endDateTime: "2025-07-01",
};

const commentsData = [
  {
    id: "1",
    avatar: "🐶",
    username: "JASON AHN",
    timestamp: "25.06.01 12:50:24",
    content:
      "마카롱 떡아는 가격도 그렇고 상황이 딱맞긴 부분도 있고, 또 테일 출력 DC볼보도 성김만큼, 제가 소유하고 있는 가방 관 전자제품을 안테솔리 모델이 2번기로 추가 공유할게요!",
  },
  {
    id: "2",
    avatar: "🐋",
    username: "JASON AHN",
    timestamp: "25.06.01 12:50:24",
    content:
      "마카롱 떡아는 가격도 그렇고 상황이 딱맞긴 부분도 있고, 또 테일출 력 DC볼보도 성김만큼, 제가 소유하고 있는 가방 관 전자제품을안테 솔리 모델이 2번기로 추가 공유할게요!",
  },
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 3}`,
    avatar: i % 2 === 0 ? "🐱" : "🐰",
    username: `USER ${i + 1}`,
    timestamp: "25.06.01 12:50:24",
    content: `이것은 스크롤 테스트를 위한 추가 댓글입니다. 댓글 #${i + 1}`,
  })),
];

export default function ModalSection() {
  const { currentModal, closeModal } = useModal();
  return (
    <>
      <ModalContainer
        isOpen={currentModal === "comments"}
        onClose={() => closeModal()}
        withAnimation={false}
      >
        {(handleClose: () => void) => (
          <>
            <ModalHeader onClose={handleClose}>
              <div className="px-6 pb-6">
                <h1 className="text-black text-lg font-bold">
                  {productData.koreanTitle}
                </h1>
                <p className="text-black text-sm">{productData.englishTitle}</p>
              </div>
            </ModalHeader>
            <CommentsContent comments={commentsData} />
          </>
        )}
      </ModalContainer>

      <ModalContainer
        isOpen={currentModal === "details"}
        onClose={() => closeModal()}
      >
        {(handleClose: () => void) => (
          <>
            <ModalHeader onClose={handleClose} />
            <div className="space-y-4 px-6">
              <PriceInfo
                currentPrice={productData.currentPrice}
                totalPieces={productData.totalPieces}
                remainingPieces={productData.remainingPieces}
              />
              <BalanceInfo depositBalance={1200000000} />
              <AmountSection piecePrice={productData.currentPrice} />
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
