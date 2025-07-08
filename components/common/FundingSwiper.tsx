'use client';

import React from 'react';
import { FundingProductType } from '@/types/ProductTypes';
import FundingItemCard from './FundingItemCard';
import Swiper from './Swiper';

interface FundingSwiperProps {
  products: FundingProductType[];
}

export default function FundingSwiper({ products }: FundingSwiperProps) {
  const renderFundingItem = (product: FundingProductType) => (
    <FundingItemCard product={product} isMainPage={true} />
  );

  return (
    <Swiper
      items={products}
      renderItem={renderFundingItem}
      config={{
        autoPlayInterval: 3000,
        threshold: 0.3,
        gap: 16,
      }}
      showIndicators={true}
    />
  );
}
