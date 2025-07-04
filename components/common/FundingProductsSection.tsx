import React from 'react';
import { FundingProductType } from '@/types/ProductTypes';
import FundingSwiper from './FundingSwiper';

interface FundingProductsSectionProps {
  products: FundingProductType[];
}

export default function FundingProductsSection({
  products,
}: FundingProductsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">공모</h2>
      <FundingSwiper products={products} />
    </div>
  );
}
