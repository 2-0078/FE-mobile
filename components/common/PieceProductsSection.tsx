import React from 'react';
import { PieceProductType } from '@/types/ProductTypes';
import PieceProductList from './PieceProductList';

interface PieceProductsSectionProps {
  products: PieceProductType[];
}

export default function PieceProductsSection({
  products,
}: PieceProductsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-custom-green">PIECE TOP 5</h2>
      <PieceProductList products={products} />
    </div>
  );
}
