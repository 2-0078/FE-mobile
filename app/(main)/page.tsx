import React from 'react';
import Search from '@/components/common/Search';
import { TypingTitleWrapper } from '@/components/layout/TitleWrapper';
import PageWrapper from '@/components/layout/PageWrapper';
import HeaderLayout from '@/components/layout/HeaderLayout';
import FundingProductsSection from '@/components/common/FundingProductsSection';
import PieceProductsSection from '@/components/common/PieceProductsSection';
import { auth } from '@/auth';
import { MemberService } from '@/services/MemberService';
import { ProductService } from '@/services/ProductService';
import AmmountCard from '@/components/AmmountCard';

export default async function page() {
  const session = await auth();
  const isAuth = !!session?.user;
  let memberProfile = undefined;

  if (isAuth) {
    memberProfile = await MemberService.getMemberProfile(
      session.user.memberUuid
    );
  }

  // ProductService를 사용하여 상품 데이터 가져오기
  const { fundingProducts, pieceProducts } =
    await ProductService.getAllProducts(1, 10);

  return (
    <>
      <HeaderLayout
        isLoggedIn={isAuth}
        userName={memberProfile?.nickname || undefined}
        userImageUrl={memberProfile?.profileImageUrl || undefined}
      />
      <PageWrapper>
        <div className="space-y-2">
          <TypingTitleWrapper
            text="투자는 Piece of Cake"
            speed={80}
            delay={500}
          />
          <TypingTitleWrapper text="Trading Hub" speed={80} delay={2000} />
        </div>
        <Search />
        <AmmountCard user={isAuth} />
        <div className="space-y-8">
          <FundingProductsSection products={fundingProducts} />
          <PieceProductsSection products={pieceProducts} />
        </div>
      </PageWrapper>
    </>
  );
}
