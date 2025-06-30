import { CountdownTimer } from "@/components/CountdownTimer";
import { BottomActions } from "@/components/BottomActions";
import ModalSection from "@/components/(products)/ModalSection";
import InfoCardLayout from "@/components/layout/InfoCardLayout";
import { ClockIcon, Puzzle } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import ProductTitleWrapper from "@/components/layout/ProductTitleWrapper";
import Image from "next/image";
import { getFundingProduct } from "@/action/product-service";
import PurchaseModalSection from "@/components/(main)/PurchaseModalSection";
import { getFundingWish } from "@/action/funding-service";
import { getReplies, getRepliesUuid } from "@/action/reply-service";
import { getMemberProfile } from "@/action/member-service";
import { ReplyTypeWithPeople } from "@/types/CommunityTypes";

export default async function FundingPage({
  params,
  searchParams,
}: {
  params: Promise<{ fundingUuid: string }>;
  searchParams: Promise<{ commentPage: string }>;
}) {
  const param = await params;
  const commentPage = (await searchParams).commentPage || "1";
  const fundingProductData = await getFundingProduct(param.fundingUuid);
  const iswish = await getFundingWish(param.fundingUuid);
  const replyUuidList = await getRepliesUuid(
    "PIECE",
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
  return (
    <PageWrapper>
      <div className="relative rounded-xl overflow-hidden w-full h-[50vh]">
        <Image
          src={fundingProductData.images[0].imageUrl}
          alt={fundingProductData.productName}
          fill={true}
          className="object-contain"
        />
      </div>

      <div className="mb-12">
        <ProductTitleWrapper className="text-white whitespace-pre-line">
          {fundingProductData.productName}
        </ProductTitleWrapper>
        <ProductTitleWrapper className="text-custom-gray-200 text-base whitespace-pre-line font-medium">
          {fundingProductData.mainCategory.categoryName} &gt;{" "}
          {fundingProductData.subCategory.categoryName}
        </ProductTitleWrapper>
      </div>

      <CountdownTimer
        endDateTime={fundingProductData.funding.fundingDeadline}
      />
      <div className="flex justify-around gap-x-2">
        <InfoCardLayout
          className="border-white border-1"
          title="현재 남은 조각"
          icon={<Puzzle />}
        >
          <span className="text-base font-semibold text-white leading-none">
            {fundingProductData.funding.remainingPieces} /{" "}
            {fundingProductData.funding.totalPieces}
          </span>
        </InfoCardLayout>
        <InfoCardLayout
          className="border-white border-1"
          title="현재 공모가"
          icon={<ClockIcon />}
        >
          <span className="text-base font-semibold text-white leading-none">
            {fundingProductData.funding.fundingAmount.toLocaleString()}원
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
          {fundingProductData.aiEstimatedPrice.toLocaleString()}원
        </p>
        <p className="text-white text-base font-medium">AI예측가</p>
      </div>
      <div className="border-custom-green border-[1px] rounded-2xl p-4 w-full">
        <p className="text-xs font-medium">
          해당 상품은{" "}
          <span className="font-bold">
            약 {fundingProductData.aiEstimatedPrice.toLocaleString()}원
          </span>
          의 가치가 있는 상품입니다.
          <br />
          {fundingProductData.aiEstimatedDescription}
        </p>
      </div>
      <BottomActions isWish={iswish} itemUuid={param.fundingUuid} />
      <ModalSection
        productData={fundingProductData}
        replyList={replyData}
        itemUuid={param.fundingUuid}
      />
      <PurchaseModalSection />
    </PageWrapper>
  );
}
