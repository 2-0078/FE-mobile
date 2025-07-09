import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { getFundingProduct } from '@/action/product-service';
import PageWrapper from '@/components/layout/PageWrapper';
import ProductTitleWrapper from '@/components/layout/ProductTitleWrapper';
import { CountdownTimer } from '@/components/CountdownTimer';
import InfoCardLayout from '@/components/layout/InfoCardLayout';
import { BottomActions } from '@/components/BottomActions';
import ModalSection from '@/components/(products)/ModalSection';
import FundingDetailClient from '@/components/common/FundingDetailClient';
import ImageSwiper from '@/components/common/ImageSwiper';
import { Puzzle } from 'lucide-react';
import ClockIcon from '@/repo/ui/Icons/ClockIcon';
import { generateFundingMetadata } from '@/lib/metadata';
import { generateFundingProductJsonLd } from '@/lib/structured-data';
import CategorySection from '@/components/(products)/CategorySection';
import { cn } from '@/lib/utils';
import Price from '@/components/layout/Price';
import AIPricePrediction from '@/components/common/AIPricePrediction';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ fundingUuid: string }>;
}): Promise<Metadata> {
  const param = await params;
  const data = await getFundingProduct(param.fundingUuid);

  return generateFundingMetadata(
    {
      title: data.productName,
      description: data.description,
      price: data.funding.fundingAmount,
      category: data.mainCategory.categoryName,
      imageUrl: data.images[0]?.imageUrl,
      remainingPieces: data.funding.remainingPieces,
      totalPieces: data.funding.totalPieces,
      fundingStatus: data.funding.fundingStatus,
    },
    param.fundingUuid
  );
}

export default async function FundingPage({
  params,
}: {
  params: Promise<{ fundingUuid: string }>;
}) {
  const param = await params;
  const data = await getFundingProduct(param.fundingUuid);

  return (
    <>
      <Script
        id="funding-product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateFundingProductJsonLd({
              name: data.productName,
              description: data.description,
              image: data.images[0]?.imageUrl || '',
              url: `https://pieceofcake.site/funding/${param.fundingUuid}`,
              price: data.funding.fundingAmount,
              priceCurrency: 'KRW',
              category: data.mainCategory.categoryName,
              availability:
                data.funding.remainingPieces > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              remainingPieces: data.funding.remainingPieces,
              totalPieces: data.funding.totalPieces,
              fundingStatus: data.funding.fundingStatus,
            })
          ),
        }}
      />
      <FundingDetailClient
        fundingUuid={param.fundingUuid}
        productUuid={data.productUuid}
        productData={data}
      >
        <PageWrapper className="pt-15">
          <ImageSwiper images={data.images} alt={data.productName} />

          <CountdownTimer endDateTime={data.funding.fundingDeadline} />
          <div
            className={cn(
              'text-white',
              'flex items-center gap-2  text-[0.725rem]'
            )}
          >
            <span className="text-custom-green">
              #{data.mainCategory.categoryName}
            </span>
            <span className="text-custom-green">
              #{data.subCategory.categoryName}
            </span>
          </div>
          <div className="mb-12">
            <ProductTitleWrapper className="text-white whitespace-pre-line">
              {data.productName}
            </ProductTitleWrapper>
            <ProductTitleWrapper className="text-custom-gray-200 text-base whitespace-pre-line font-medium">
              {data.description}
            </ProductTitleWrapper>
          </div>
          {/* 조각당 가격  왼쪽정렬*/}
          <Price
            className="text-white text-3xl font-bold justify-start"
            price={data.funding.piecePrice}
          />

          <div className="flex justify-around gap-x-2">
            <InfoCardLayout
              className="border-custom-green/50 border-1"
              title="현재 남은 조각"
              icon={<Puzzle />}
            >
              <p className="text-base font-semibold text-white leading-none">
                <span className="text-custom-green">
                  {data.funding.remainingPieces}
                </span>
                / {data.funding.totalPieces}개
              </p>
            </InfoCardLayout>
            <InfoCardLayout
              className="border-white/50 border-1"
              title="현재 공모가"
              icon={<ClockIcon />}
            >
              <span className="text-base font-semibold text-white leading-none">
                {data.funding.fundingAmount.toLocaleString()}원
              </span>
            </InfoCardLayout>
          </div>
          <AIPricePrediction
            aiEstimatedPrice={data.aiEstimatedPrice}
            description={data.description}
          />
        </PageWrapper>
      </FundingDetailClient>
    </>
  );
}
