import React from 'react';
import { PieceService } from '@/services/PieceService';
import CategorySection from '@/components/(products)/CategorySection';
import Search from '@/components/common/Search';
import Pagenation from '@/components/common/Pagenation';
import FilterButtons from '@/components/(products)/FilterButtons';
import Header from '@/components/layout/Header';
import PieceProductList from '@/components/(products)/PieceProductList';
import ProductCount from '@/components/common/ProductCount';

export default async function PiecePage({
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
  const selectedSort = PieceService.convertSortByToKorean(params.sortBy);
  const selectedMainCategory = params.main || '전체';
  const selectedSubCategory = params.sub || '전체';
  const selectedSearch = params.search || '';
  const selectedPage = params.page || 0;

  // 데이터 패칭
  const [mainCategories, subCategories, pieceResult] = await Promise.all([
    PieceService.getMainCategories(),
    PieceService.getSubCategories(selectedMainCategory),
    PieceService.getPieceProducts({
      sortBy: params.sortBy || 'ID',
      main: selectedMainCategory,
      sub: selectedSubCategory,
      search: selectedSearch,
      page: selectedPage,
    }),
  ]);

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

      <ProductCount totalElements={pieceResult.totalElements} />

      <PieceProductList products={pieceResult.products} />

      <Pagenation totalPages={pieceResult.totalPage} />
    </div>
  );
}
