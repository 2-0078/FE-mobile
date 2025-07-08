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
import { Puzzle } from 'lucide-react';
import ClockIcon from '@/repo/ui/Icons/ClockIcon';
import { generateFundingMetadata } from '@/lib/metadata';
import { generateFundingProductJsonLd } from '@/lib/structured-data';

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
      <PageWrapper>
        <div className="relative rounded-xl overflow-hidden w-full h-[50vh]">
          <Image
            src={data.images[0].imageUrl}
            alt={data.productName}
            fill={true}
            sizes="100vw"
            className="object-contain"
          />
        </div>

        <div className="mb-12">
          <ProductTitleWrapper className="text-white whitespace-pre-line">
            {data.productName}
          </ProductTitleWrapper>
          <ProductTitleWrapper className="text-custom-gray-200 text-base whitespace-pre-line font-medium">
            {data.description}
          </ProductTitleWrapper>
        </div>

        <CountdownTimer endDateTime={data.funding.fundingDeadline} />
        <div className="flex justify-around gap-x-2">
          <InfoCardLayout
            className="border-white border-1"
            title="현재 남은 조각"
            icon={<Puzzle />}
          >
            <span className="text-base font-semibold text-white leading-none">
              {data.funding.remainingPieces}개
            </span>
          </InfoCardLayout>
          <InfoCardLayout
            className="border-white border-1"
            title="현재 공모가"
            icon={<ClockIcon />}
          >
            <span className="text-base font-semibold text-white leading-none">
              {data.funding.fundingAmount.toLocaleString()}원
            </span>
          </InfoCardLayout>
        </div>
        <div className="text-center items-center gap-y-4 bg-[url('/Bgimage.svg')] bg-cover bg-no-repeat">
          <Image
            src="/Chatbot.png"
            alt="chatbot"
            width={126}
            height={126}
            className="mx-auto"
          />
          <p className="text-custom-green text-4xl font-bold">
            {data.aiEstimatedPrice.toLocaleString()}원
          </p>
          <p className="text-white text-base font-medium">AI예측가</p>
        </div>
        <div className="border-custom-green border-[1px] rounded-2xl p-4 w-full">
          <p className="text-xs font-medium">
            해당 상품은{' '}
            <span className="font-bold">
              약 {data.aiEstimatedPrice.toLocaleString()}원
            </span>
            의 가치가 있는 상품입니다.
            <br />
            {data.description}
          </p>
        </div>
        <BottomActions />
        <ModalSection
          productData={data}
          itemUuid={param.fundingUuid}
          type="FUNDING"
        />
      </PageWrapper>
    </>
  );
}
