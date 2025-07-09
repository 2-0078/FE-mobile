import React from 'react';
import Header from '@/components/layout/Header';
import Search from '@/components/common/Search';
import CategorySection from '@/components/(products)/CategorySection';
import FilterButtons from '@/components/(products)/FilterButtons';
import ProductCount from '@/components/common/ProductCount';
import PieceProductList from '@/components/(products)/PieceProductList';
import Pagenation from '@/components/common/Pagenation';
import { CategoryType, PieceProductType } from '@/types/ProductTypes';

interface PiecePageTemplateProps {
  mainCategories: CategoryType[];
  subCategories: CategoryType[];
  pieceProducts: PieceProductType[];
  totalElements: number;
  totalPage: number;
  selectedSort: string;
}

export default function PiecePageTemplate({
  mainCategories,
  subCategories,
  pieceProducts,
  totalElements,
  totalPage,
  selectedSort,
}: PiecePageTemplateProps) {
  return (
    <div className="pb-20 pt-24">
      <Header title="PIECES" isCloseButton={true} />

      <div className="px-4 mb-4">
        <Search />
      </div>

      <CategorySection
        mainCategories={mainCategories}
        subCategories={subCategories}
      />

      <FilterButtons selectedSort={selectedSort} pageType="piece" />

      <ProductCount totalElements={totalElements} />

      <PieceProductList products={pieceProducts} />

      <Pagenation totalPages={totalPage} />
    </div>
  );
}
