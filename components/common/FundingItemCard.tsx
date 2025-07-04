import React from 'react';
import { FundingProductType } from '@/types/ProductTypes';
import ItemCardImage from './ItemCardImage';
import ItemCardInfo from './ItemCardInfo';

interface FundingItemCardProps {
  product: FundingProductType;
}

export default function FundingItemCard({ product }: FundingItemCardProps) {
  const { funding } = product;
  const thumbnailImage =
    product.images.find((img) => img.isThumbnail)?.imageUrl ||
    product.images[0]?.imageUrl;
  const remainingPieces = product.funding.remainingPieces;
  const totalPieces = product.funding.totalPieces;

  return (
    <div className="w-full rounded-lg shadow-lg bg-black/50 overflow-hidden relative mx-auto items-center justify-center border border-custom-green/50 sh shadow-custom-green">
      <ItemCardImage
        type="funding"
        remainingTime={funding.fundingDeadline}
        thumbnail={thumbnailImage}
      />
      <ItemCardInfo
        productName={product.productName}
        mainCategory={product.mainCategory.categoryName}
        subCategory={product.subCategory.categoryName}
        price={product.funding.piecePrice}
        description={product.aiEstimatedDescription || undefined}
        fundingStatus={funding.fundingStatus as 'FUNDING' | 'FUNDING_SUCCESS'}
        type="funding"
        progress={
          totalPieces > 0
            ? ((totalPieces - remainingPieces) / totalPieces) * 100
            : 0
        }
      />
    </div>
  );
}
