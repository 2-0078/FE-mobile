import React from 'react';
import { PieceProductType } from '@/types/ProductTypes';
import ItemCardImage from './ItemCardImage';
import ItemCardInfo from './ItemCardInfo';
import AnimatedPrice from './AnimatedPrice';

interface PieceItemCardProps {
  product: PieceProductType;
}

export default function PieceItemCard({ product }: PieceItemCardProps) {
  const { piece } = product;
  const thumbnailImage = product.images.find(img => img.isThumbnail)?.imageUrl || product.images[0]?.imageUrl;

  return (
    <div className="w-full rounded-2xl shadow-lg bg-white overflow-hidden relative mx-auto items-center justify-center">
      <ItemCardImage
        remainingTime={`${piece.tradeQuantity}개`}
        thumbnail={thumbnailImage}
      />
      <ItemCardInfo 
        productName={product.productName}
        price={piece.closingPrice || product.aiEstimatedPrice}
        type="piece"
        priceComponent={
          <AnimatedPrice 
            price={piece.closingPrice || product.aiEstimatedPrice} 
          />
        }
      />
    </div>
  );
} 