import React from 'react';
import { FundingProductType } from '@/types/ProductTypes';
import ItemCardImage from './ItemCardImage';
import ItemCardInfo from './ItemCardInfo';
import { CountdownTimer } from '@/components/CountdownTimer';

interface FundingItemCardProps {
  product: FundingProductType;
}

export default function FundingItemCard({ product }: FundingItemCardProps) {
  const { funding } = product;
  const thumbnailImage = product.images.find(img => img.isThumbnail)?.imageUrl || product.images[0]?.imageUrl;
  const remainingPieces = product.funding.remainingPieces;
  const totalPieces = product.funding.totalPieces;
  const progress = ((totalPieces - remainingPieces) / totalPieces) * 100;

  return (
    <div className="w-full rounded-2xl shadow-lg bg-white overflow-hidden relative mx-auto items-center justify-center">
      <ItemCardImage
        remainingTime={<CountdownTimer endDateTime={funding.fundingDeadline} />}
        thumbnail={thumbnailImage}
      />
      <ItemCardInfo 
        productName={product.productName}
        price={product.funding.piecePrice}
        progress={progress}
        remainingPieces={remainingPieces}
        totalPieces={totalPieces}
        type="funding"
      />
    </div>
  );
} 