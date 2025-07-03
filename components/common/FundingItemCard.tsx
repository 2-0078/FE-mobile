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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden shadow-lg border border-blue-200">
      <div className="relative">
        <ItemCardImage
          remainingTime={<CountdownTimer endDateTime={funding.fundingDeadline} />}
          thumbnail={thumbnailImage}
        />
      </div>
      <div className="p-4">
        <ItemCardInfo 
          productName={product.productName}
          price={product.funding.piecePrice}
          progress={progress}
          remainingPieces={remainingPieces}
          totalPieces={totalPieces}
          type="funding"
        />
      </div>
    </div>
  );
} 