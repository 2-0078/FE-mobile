<<<<<<< HEAD
import { CountdownTimer } from "@/components/CountdownTimer";
import { BottomActions } from "@/components/BottomActions";
import ModalSection from "@/components/(products)/ModalSection";
import InfoCardLayout from "@/components/layout/InfoCardLayout";
import { ClockIcon, Puzzle } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import ProductTitleWrapper from "@/components/layout/ProductTitleWrapper";
import Image from "next/image";
import { getFundingProduct } from "@/action/product-service";
=======
import { CountdownTimer } from '@/components/CountdownTimer';
import { BottomActions } from '@/components/BottomActions';
import ModalSection from '@/components/(products)/ModalSection';
import InfoCardLayout from '@/components/layout/InfoCardLayout';
import { ClockIcon, Puzzle } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import ProductTitleWrapper from '@/components/layout/ProductTitleWrapper';
import Image from 'next/image';
import { getFundingProduct } from '@/action/product-service';
import PurchaseModalSection from '@/components/(main)/PurchaseModalSection';
import { getFundingWish } from '@/action/funding-service';
import { getReplies, getRepliesUuid } from '@/action/reply-service';
import { getMemberProfile } from '@/action/member-service';
import { ReplyTypeWithPeople } from '@/types/CommunityTypes';
>>>>>>> feat/productsPage

export default async function FundingPage({
  params,
}: {
  params: Promise<{ fundingUuid: string }>;
}) {
  const param = await params;
<<<<<<< HEAD
  const data = await getFundingProduct(param.fundingUuid);
=======
  const commentPage = (await searchParams).commentPage || '1';
  const fundingProductData = await getFundingProduct(param.fundingUuid);
  const iswish = await getFundingWish(param.fundingUuid);
  const replyUuidList = await getRepliesUuid(
    'PIECE',
    param.fundingUuid,
    commentPage
  );
  const replyData = await Promise.all(
    replyUuidList.map(async (reply) => {
      const replyData = await getReplies(reply.replyUuid);
      const replyUserInfo = await getMemberProfile(replyData.memberUuid);
      return { ...replyData, replyUserInfo } as ReplyTypeWithPeople;
    })
  );
  console.log(iswish);
>>>>>>> feat/productsPage
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
<<<<<<< HEAD
          {data.mainCategory.categoryName} &gt; {data.subCategory.categoryName}
=======
          {fundingProductData.mainCategory.categoryName} &gt;{' '}
          {fundingProductData.subCategory.categoryName}
>>>>>>> feat/productsPage
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
<<<<<<< HEAD
            {data.funding.remainingPieces} / {data.funding.totalPieces}
=======
            {fundingProductData.funding.remainingPieces} /{' '}
            {fundingProductData.funding.totalPieces}
>>>>>>> feat/productsPage
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
