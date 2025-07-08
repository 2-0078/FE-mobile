import React from 'react';
import { FundingService } from '@/services/FundingService';
import CategorySection from '@/components/(products)/CategorySection';
import Search from '@/components/common/Search';
import Pagenation from '@/components/common/Pagenation';
import { FundingListSection } from '@/components/(products)/FundingListSection';
import FilterButtons from '@/components/(products)/FilterButtons';
import Header from '@/components/layout/Header';
import ProductCount from '@/components/common/ProductCount';

export default async function FundingPage({
  searchParams,
}: {
  searchParams: Promise<{
    sortBy: string;
    main: string;
    sub: string;
    search: string;
    page: number;
  }>;
}) {
  // URL 파라미터 처리
  const params = await searchParams;
  const selectedSort = FundingService.convertSortByToKorean(params.sortBy);
  const selectedMainCategory = params.main || '전체';
  const selectedSubCategory = params.sub || '전체';
  const selectedSearch = params.search || '';
  const selectedPage = params.page || 0;

  // 데이터 패칭
  const [mainCategories, subCategories, fundingResult] = await Promise.all([
    FundingService.getMainCategories(),
    FundingService.getSubCategories(selectedMainCategory),
    FundingService.getFundingProducts({
      sortBy: params.sortBy || 'ID',
      main: selectedMainCategory,
      sub: selectedSubCategory,
      search: selectedSearch,
      page: selectedPage,
    }),
  ]);

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

      <ProductCount totalElements={fundingResult.totalElements} />

      <FundingListSection fundingProducts={fundingResult.products} />

      <Pagenation totalPages={fundingResult.totalPage} />
    </div>
  );
}
