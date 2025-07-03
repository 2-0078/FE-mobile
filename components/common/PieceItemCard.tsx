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
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl overflow-hidden shadow-lg border border-green-200">
      <div className="relative">
        <ItemCardImage
          remainingTime={`${piece.tradeQuantity}개`}
          thumbnail={thumbnailImage}
        />
      </div>
      <div className="p-4">
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
    </div>
  );
} 