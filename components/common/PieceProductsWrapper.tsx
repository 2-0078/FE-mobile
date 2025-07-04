'use client';

import React from 'react';
import { PieceProductType } from '@/types/ProductTypes';
import PieceProductsSection from './PieceProductsSection';

interface PieceProductsWrapperProps {
  products: PieceProductType[];
}

export default function PieceProductsWrapper({
  products,
}: PieceProductsWrapperProps) {
  return <PieceProductsSection products={products} />;
}
