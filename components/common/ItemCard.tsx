import React from 'react';
import ItemCardInfo from '@/components/common/ItemCardInfo';
import ItemCardImage from '@/components/common/ItemCardImage';
import { FundingProductType, PieceProductType } from '@/types/ProductTypes';

interface ItemCardProps {
  product?: FundingProductType | PieceProductType;
}

export default function ItemCard({ product }: ItemCardProps) {
  if (!product) {
    // 기본 카드 (데이터가 없을 때)
    return (
      <div className="w-full rounded-2xl shadow-lg bg-white overflow-hidden relative mx-auto items-center justify-center">
        <ItemCardImage
          remainingTime="18h : 32m : 04s"
          thumbnail="https://previews.123rf.com/images/adrian1991/adrian19912109/adrian1991210900001/174101000-%EB%B3%84%EC%9D%B4-%EB%B9%9B%EB%82%98%EB%8A%94-%EB%B0%A4-%EB%B9%88%EC%84%BC%ED%8A%B8-%EB%B0%98-%EA%B3%A0%ED%9D%90-%EA%B7%B8%EB%A6%BC.jpg"
          type="funding"
        />
        <ItemCardInfo />
      </div>
    );
  }

  // 실제 상품 데이터가 있을 때
  const thumbnailImage =
    product.images.find((img) => img.isThumbnail)?.imageUrl ||
    product.images[0]?.imageUrl;

  // 타입 가드로 펀딩 상품과 조각 상품 구분
  const isFundingProduct = 'funding' in product;

  if (isFundingProduct) {
    // 펀딩 상품인 경우
    const fundingProduct = product as FundingProductType;
    const remainingPieces = fundingProduct.funding.remainingPieces;
    const totalPieces = fundingProduct.funding.totalPieces;
    const progress = ((totalPieces - remainingPieces) / totalPieces) * 100;

    return (
      <div className="w-full rounded-2xl shadow-lg bg-white overflow-hidden relative mx-auto items-center justify-center">
        <ItemCardImage
          remainingTime={`${remainingPieces}개 남음`}
          thumbnail={thumbnailImage}
          type="funding"
        />
        <ItemCardInfo
          productName={fundingProduct.productName}
          price={fundingProduct.funding.piecePrice}
          progress={progress}
        />
      </div>
    );
  } else {
    // 조각 상품인 경우
    const pieceProduct = product as PieceProductType;
    const isTrading = pieceProduct.piece.isTrading;
    const tradeQuantity = pieceProduct.piece.tradeQuantity;
    const closingPrice = pieceProduct.piece.closingPrice;

    return (
      <div className="w-full rounded-2xl shadow-lg bg-white overflow-hidden relative mx-auto items-center justify-center">
        <ItemCardImage
          remainingTime={isTrading ? `${tradeQuantity}개 거래중` : '거래 종료'}
          thumbnail={thumbnailImage}
          type="piece"
        />
        <ItemCardInfo
          productName={pieceProduct.productName}
          price={closingPrice || 0}
          progress={undefined}
        />
      </div>
    );
  }
}
