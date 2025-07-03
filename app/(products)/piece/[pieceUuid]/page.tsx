import React from 'react';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import TabLayout from '@/components/layout/TabLayout';
import InfoCardLayout from '@/components/layout/InfoCardLayout';
import TempPriceIcon from '@/repo/ui/Icons/TempPriceIcon';
import ClockIcon from '@/repo/ui/Icons/ClockIcon';

// 작품 카드 컴포넌트
function ArtworkCard({ imageUrl, title }: { imageUrl: string; title: string }) {
  return (
    <div className="relative">
      <img src={imageUrl} alt={title} className="w-full h-64 object-cover rounded-lg" />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h2 className="text-white text-lg font-semibold">{title}</h2>
      </div>
    </div>
  );
}

// 가격 및 남은 시간 컴포넌트
function InfoCards() {
  return (
    <div className="flex justify-around gap-x-3">
      <InfoCardLayout
        className="h-12 border-white border-1"
        title="Highest Bid"
        icon={<TempPriceIcon />}
      >
        <span className="text-base font-semibold text-white leading-none">
          15,800,000
        </span>
      </InfoCardLayout>
      <InfoCardLayout
        className="h-12 border-white border-1"
        title="Time Left"
        icon={<ClockIcon />}
      >
        <span className="text-base font-semibold text-white leading-none">
          2h 4m 52s
        </span>
      </InfoCardLayout>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default function FundingPage() {
  return (
    <PageWrapper>
      <Header isAlert={false} />
      <div>
        <ArtworkCard imageUrl="/example.png" title="KATSUSHIKA HOKUSAI" />
      </div>
      <InfoCards />
      <TabLayout tabs={["Details", "Owners", "Bids", "History"]}>
        <div>
          Lorem ipsum dolor sit amet, consectetur elit. Quisque non elit mauris.
          Cras euismod, Lorem ipsum metus ac finibus finibus, felis dui
          suscipit...
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur elit. Quisque non elit mauris.
          Cras euismod, assaLorem ipsum metus ac finibus finibus, felis dui
          suscipit...sadasdasda
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur elit. Quisque non elit mauris.
          Cras euismod, Lorem ipsum metus ac finibus finibus, felis dui
          suscipit...
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur elit. Quisque non elit mauris.
          Cras euismod, Lorem ipsum metus ac finibus finibus, felis dui
          suscipit...
        </div>
      </TabLayout>
    </PageWrapper>
  );
}
