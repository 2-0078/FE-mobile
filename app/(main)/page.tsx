import React, { Suspense } from 'react';
import Search from '@/components/common/Search';
import TitleWrapper from '@/components/layout/TitleWrapper';
import PageWrapper from '@/components/layout/PageWrapper';
import HeaderLayout from '@/components/layout/HeaderLayout';
import ProductGrid from '@/components/common/ProductGrid';
import ProductGridSkeleton from '@/components/common/ProductGridSkeleton';
import { auth } from '@/auth';
import { getMemberProfile } from '@/action/member-service';
import {
  getFundingProductsList,
  getFundingProduct,
  getPieceProductsList,
  getPieceProducts,
} from '@/action/product-service';
import AmmountCard from '@/components/AmmountCard';

export default async function page() {
  const session = await auth();
  const isAuth = !!session?.user;
  let memberProfile = undefined;

  if (isAuth) {
    memberProfile = await getMemberProfile(session.user.memberUuid);
  }

  // 상품 데이터 가져오기
  const [fundingProductsList, pieceProductsList] = await Promise.all([
    getFundingProductsList({ page: 1, size: 10 }),
    getPieceProductsList(),
  ]);

  // 각 상품의 상세 정보 가져오기
  const [fundingProducts, pieceProducts] = await Promise.all([
    Promise.all(
      fundingProductsList.fundingUuidList.map(async (fundingUuid: string) => {
        try {
          return await getFundingProduct(fundingUuid);
        } catch (error) {
          console.error(
            `Failed to fetch funding product ${fundingUuid}:`,
            error
          );
          return null;
        }
      })
    ),
    Promise.all(
      pieceProductsList.pieceProductUuidList.map(async (pieceUuid: string) => {
        try {
          return await getPieceProducts(pieceUuid);
        } catch (error) {
          console.error(`Failed to fetch piece product ${pieceUuid}:`, error);
          return null;
        }
      })
    ),
  ]);

  // null 값 필터링
  const validFundingProducts = fundingProducts.filter(
    (product) => product !== null
  );
  const validPieceProducts = pieceProducts.filter(
    (product) => product !== null
  );

  return (
    <>
      <HeaderLayout
        isLoggedIn={isAuth}
        userName={memberProfile?.nickname || undefined}
        userImageUrl={memberProfile?.profileImageUrl || undefined}
      />
      <PageWrapper>
        <TitleWrapper>
          투자는{' '}
          <span className="text-custom-green font-medium wrap-break-word">
            Piece of Cake
          </span>
          <br />
          Traiding Hub
        </TitleWrapper>
        <Search />
        <AmmountCard user={isAuth} />
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid
            fundingProducts={validFundingProducts}
            pieceProducts={validPieceProducts}
          />
        </Suspense>
      </PageWrapper>
    </>
  );
}
