import React from 'react';
import Header from '@/components/layout/Header';
import Search from '@/components/common/Search';
import CategorySection from '@/components/(products)/CategorySection';
import FilterButtons from '@/components/(products)/FilterButtons';
import ProductCount from '@/components/common/ProductCount';
import { FundingListSection } from '@/components/(products)/FundingListSection';
import Pagenation from '@/components/common/Pagenation';
import { CategoryType, FundingProductType } from '@/types/ProductTypes';

interface FundingPageTemplateProps {
  mainCategories: CategoryType[];
  subCategories: CategoryType[];
  fundingProducts: FundingProductType[];
  totalElements: number;
  totalPage: number;
  selectedSort: string;
}

export default function FundingPageTemplate({
  mainCategories,
  subCategories,
  fundingProducts,
  totalElements,
  totalPage,
  selectedSort,
}: FundingPageTemplateProps) {
  return (
    <div className="pb-20 pt-24">
      <Header title="FUNDINGS" isCloseButton={true} />

      <div className="px-4 my-4">
        <Search />
      </div>

      <CategorySection
        mainCategories={mainCategories}
        subCategories={subCategories}
      />

      <FilterButtons selectedSort={selectedSort} />

      <ProductCount totalElements={totalElements} />

      <FundingListSection fundingProducts={fundingProducts} />

      <Pagenation totalPages={totalPage} />
    </div>
  );
}
