import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';
import Search from '@/components/common/Search';
import { TypingTitleWrapper } from '@/components/layout/TitleWrapper';
import PageWrapper from '@/components/layout/PageWrapper';
import HeaderLayout from '@/components/layout/HeaderLayout';
import FundingProductsSection from '@/components/common/FundingProductsSection';
import PieceProductsWrapper from '@/components/common/PieceProductsWrapper';
import { auth } from '@/auth';
import { MemberService } from '@/services/MemberService';
import { ProductService } from '@/services/ProductService';
import AmmountCard from '@/components/AmmountCard';
import {
  generateWebsiteJsonLd,
  generateOrganizationJsonLd,
} from '@/lib/structured-data';

export const metadata: Metadata = {
  title: '홈',
  description:
    'Piece of Cake에서 다양한 투자 기회를 발견하세요. 부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자하고 수익을 창출하세요.',
  keywords: [
    '투자',
    '조각투자',
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
    title: 'Piece of Cake - 투자 조각 구매 플랫폼',
    description:
      '부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자하고 수익을 창출하세요.',
    url: 'https://pieceofcake.site',
    siteName: 'Piece of Cake',
    images: [
      {
        url: 'https://pieceofcake.site/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Piece of Cake - 투자 조각 구매 플랫폼',
        type: 'image/png',
      },
      {
        url: 'https://pieceofcake.site/og-image-square.png',
        width: 600,
        height: 600,
        alt: 'Piece of Cake - 투자 조각 구매 플랫폼',
        type: 'image/png',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
    countryName: 'South Korea',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Piece of Cake - 투자 조각 구매 플랫폼',
    description:
      '부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자하고 수익을 창출하세요.',
    images: ['/og-image.png'],
  },
};

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
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebsiteJsonLd()),
        }}
      />
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateOrganizationJsonLd({
              name: 'Piece of Cake',
              url: 'https://pieceofcake.site',
              logo: 'https://pieceofcake.site/logo.png',
              description:
                '부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자할 수 있는 플랫폼',
              contactPoint: {
                telephone: '+82-2-1234-5678',
                contactType: 'customer service',
              },
              sameAs: [
                'https://www.facebook.com/pieceofcake',
                'https://www.instagram.com/pieceofcake',
                'https://twitter.com/pieceofcake',
              ],
            })
          ),
        }}
      />
      <HeaderLayout
        isLoggedIn={isAuth}
        userName={memberProfile?.nickname || undefined}
        userImageUrl={memberProfile?.profileImageUrl || undefined}
      />
      <PageWrapper>
        <TypingTitleWrapper
          titleStrings={[
            'Trading Hub',
            'Piece of Cake',
            '투자는 피스오브케이크',
          ]}
          subtitleString="Investment is Easy and Fun"
          className="pb-5"
          titleClassName="text-3xl text-custom-green"
          subtitleClassName="text-sm text-white/80"
        />
        <Search />
        <AmmountCard user={isAuth} />
        <div className="space-y-8">
          <FundingProductsSection products={fundingProducts} />
          <PieceProductsWrapper products={pieceProducts} />
        </div>
      </PageWrapper>
    </>
  );
}
