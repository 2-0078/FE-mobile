import { CountdownTimer } from "@/components/CountdownTimer";
import { BottomActions } from "@/components/BottomActions";
import ModalSection from "@/components/(products)/ModalSection";
import InfoCardLayout from "@/components/layout/InfoCardLayout";
import { ClockIcon, Puzzle } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import ProductTitleWrapper from "@/components/layout/ProductTitleWrapper";
import Image from "next/image";
// 서버에서 받아올 데이터 타입들
interface ProductData {
  koreanTitle: string;
  englishTitle: string;
  imageUrl: string;
  remainingPieces: number;
  totalPieces: number;
  currentPrice: number;
  endDateTime: string; // ISO 문자열로 마감일시
}

// Mock 데이터들 - 고정된 마감일시 사용 (hydration 안전)
const productData: ProductData = {
  koreanTitle: "샤넬 클래식 플랩 백 미디움 블랙 은장",
  englishTitle: "Chanel Classic Flap Bag Medium Caviar Black A01112",
  imageUrl:
    "https://previews.123rf.com/images/adrian1991/adrian19912109/adrian1991210900001/174101000-%EB%B3%84%EC%9D%B4-%EB%B9%9B%EB%82%98%EB%8A%94-%EB%B0%A4-%EB%B9%88%EC%84%BC%ED%8A%B8-%EB%B0%98-%EA%B3%A0%ED%9D%90-%EA%B7%B8%EB%A6%BC.jpg",
  remainingPieces: 258,
  totalPieces: 1000,
  currentPrice: 2000000,
  // 고정된 미래 날짜 사용 (예: 2025년 7월 1일)
  endDateTime: "2026-01-01",
};

export default function FundingPage() {
  return (
    <PageWrapper>
      <div className="relative rounded-xl overflow-hidden w-full h-[50vh]">
        <Image
          src={productData.imageUrl}
          alt={productData.englishTitle}
          fill={true}
          className="object-contain"
        />
      </div>

      <div className="mb-12">
        <ProductTitleWrapper className="text-white whitespace-pre-line">
          {productData.koreanTitle}
        </ProductTitleWrapper>
        <ProductTitleWrapper className="text-custom-gray-200 whitespace-pre-line font-medium">
          {productData.englishTitle}
        </ProductTitleWrapper>
      </div>

      <CountdownTimer endDateTime={productData.endDateTime} />
      <div className="flex justify-around gap-x-2">
        <InfoCardLayout
          className="border-white border-1"
          title="현재 남은 조각"
          icon={<Puzzle />}
        >
          <span className="text-base font-semibold text-white leading-none">
            {productData.remainingPieces} / {productData.totalPieces}
          </span>
        </InfoCardLayout>
        <InfoCardLayout
          className="border-white border-1"
          title="현재 공모가"
          icon={<ClockIcon />}
        >
          <span className="text-base font-semibold text-white leading-none">
            {productData.currentPrice.toLocaleString()}원
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
          {Number(2500000).toLocaleString()}원
        </p>
        <p className="text-white text-base font-medium">AI예측가</p>
      </div>
      <div className="border-custom-green border-[1px] rounded-2xl p-4 w-full">
        <p className="text-xs font-medium">
          해당 상품은 <span className="font-bold">약 2,500,000원</span>
          의 가치가 있는 상품입니다.
          <br />
          Lorem ipsum dolor sit amet, consectetur elit. Quisque non elit mauris.
          Cras euismod, Lorem ipsum metus ac finibus finibus, felis dui
          suscipit....
        </p>
      </div>
      <BottomActions />
      <ModalSection />
    </PageWrapper>
  );
}
