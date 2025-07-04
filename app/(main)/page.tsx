import React from 'react';
import Search from '@/components/common/Search';
import TitleWrapper from '@/components/layout/TitleWrapper';
import PageWrapper from '@/components/layout/PageWrapper';
import HeaderLayout from '@/components/layout/HeaderLayout';
import FundingProductsSection from '@/components/common/FundingProductsSection';
import PieceProductsSection from '@/components/common/PieceProductsSection';
import { AuthService } from '@/services/AuthService';
import { ProductService } from '@/services/ProductService';
import AmmountCard from '@/components/AmmountCard';

export default async function page() {
  // AuthService를 사용하여 사용자 정보 가져오기
  const { isAuthenticated, profile } = await AuthService.getCurrentUser();

  // ProductService를 사용하여 상품 데이터 가져오기
  const { fundingProducts, pieceProducts } =
    await ProductService.getMainPageProducts();

  return (
    <>
      <HeaderLayout
        isLoggedIn={isAuthenticated}
        userName={profile?.nickname || undefined}
        userImageUrl={profile?.profileImageUrl || undefined}
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
        <AmmountCard user={isAuthenticated} />
        <div className="space-y-8">
          <FundingProductsSection products={fundingProducts} />
          <PieceProductsSection products={pieceProducts} />
        </div>
      </PageWrapper>
    </>
  );
}
