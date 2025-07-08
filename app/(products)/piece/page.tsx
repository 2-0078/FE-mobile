import React from 'react';
import { Metadata } from 'next';
import { PieceService } from '@/services/PieceService';
import CategorySection from '@/components/(products)/CategorySection';
import Search from '@/components/common/Search';
import Pagenation from '@/components/common/Pagenation';
import FilterButtons from '@/components/(products)/FilterButtons';
import Header from '@/components/layout/Header';
import PieceProductList from '@/components/(products)/PieceProductList';
import ProductCount from '@/components/common/ProductCount';

export const metadata: Metadata = {
  title: '조각 상품',
  description:
    'Piece of Cake에서 다양한 조각 상품을 발견하세요. 부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자하고 수익을 창출하세요.',
  keywords: [
    '조각투자',
    '투자',
    '부동산',
    '예술품',
    '스타트업',
    '크라우드펀딩',
    'P2P',
    '금융',
    '자산관리',
    '투자플랫폼',
  ],
  openGraph: {
    title: '조각 상품 | Piece of Cake',
    description:
      '부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자하고 수익을 창출하세요.',
    url: 'https://pieceofcake.site/piece',
    siteName: 'Piece of Cake',
    images: [
      {
        url: 'https://pieceofcake.site/og-piece.png',
        width: 1200,
        height: 630,
        alt: 'Piece of Cake - 조각 상품',
        type: 'image/png',
      },
      {
        url: 'https://pieceofcake.site/og-piece-square.png',
        width: 600,
        height: 600,
        alt: 'Piece of Cake - 조각 상품',
        type: 'image/png',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
    countryName: 'South Korea',
  },
  twitter: {
    card: 'summary_large_image',
    title: '조각 상품 | Piece of Cake',
    description:
      '부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자하고 수익을 창출하세요.',
    images: ['/og-image.png'],
  },
};

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
