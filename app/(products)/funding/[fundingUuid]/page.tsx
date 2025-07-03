import React from 'react';
import Image from 'next/image';
import { getFundingProduct } from '@/action/product-service';
import PageWrapper from '@/components/layout/PageWrapper';
import ProductTitleWrapper from '@/components/layout/ProductTitleWrapper';
import { CountdownTimer } from '@/components/CountdownTimer';
import InfoCardLayout from '@/components/layout/InfoCardLayout';
import { BottomActions } from '@/components/BottomActions';
import ModalSection from '@/components/(products)/ModalSection';
import { Puzzle } from 'lucide-react';
import ClockIcon from '@/repo/ui/Icons/ClockIcon';

export default async function FundingPage({
  params,
}: {
  params: Promise<{ fundingUuid: string }>;
}) {
  const param = await params;
  const data = await getFundingProduct(param.fundingUuid);
  
  return (
    <PageWrapper>
      <div className="relative rounded-xl overflow-hidden w-full h-[50vh]">
        <Image
          src={data.images[0].imageUrl}
          alt={data.productName}
          fill={true}
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
  );
}
