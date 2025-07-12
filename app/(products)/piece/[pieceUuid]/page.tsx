import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { getPieceProducts } from '@/action/product-service';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import TabLayout from '@/components/layout/TabLayout';
import InfoCardLayout from '@/components/layout/InfoCardLayout';
import TempPriceIcon from '@/repo/ui/Icons/TempPriceIcon';
import ClockIcon from '@/repo/ui/Icons/ClockIcon';
import { generatePieceMetadata } from '@/lib/metadata';
import { generatePieceProductJsonLd } from '@/lib/structured-data';
import { CommentSection } from '@/components/common/CommentSection';
import OrderBook from '@/components/common/OrderBook';
import OrderHistory from '@/components/common/OrderHistory';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pieceUuid: string }>;
}): Promise<Metadata> {
  const param = await params;
  const data = await getPieceProducts(param.pieceUuid);

  return generatePieceMetadata(
    {
      title: data.productName,
      description: data.description,
      price: data.piece.closingPrice || 0,
      category: data.mainCategory.categoryName,
      imageUrl: data.images[0]?.imageUrl,
      piecePrice: data.piece.closingPrice || 0,
      totalPieces: data.piece.tradeQuantity,
      availablePieces: data.piece.tradeQuantity,
    },
    param.pieceUuid
  );
}

// 작품 카드 컴포넌트
function ArtworkCard({ imageUrl, title }: { imageUrl: string; title: string }) {
  return (
    <div className="relative">
      <Image
        src={imageUrl}
        alt={title}
        width={400}
        height={256}
        className="w-full h-64 object-cover rounded-lg"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h2 className="text-white text-lg font-semibold">{title}</h2>
      </div>
    </div>
  );
}

// 가격 및 남은 시간 컴포넌트
function InfoCards({
  closingPrice,
  tradeQuantity,
}: {
  closingPrice: number | null;
  tradeQuantity: number;
}) {
  return (
    <div className="flex justify-around gap-x-3">
      <InfoCardLayout
        className="h-12 border-white border-1"
        title="현재가"
        icon={<TempPriceIcon />}
      >
        <span className="text-base font-semibold text-white leading-none">
          {closingPrice ? closingPrice.toLocaleString() : '0'}
        </span>
      </InfoCardLayout>
      <InfoCardLayout
        className="h-12 border-white border-1"
        title="거래량"
        icon={<ClockIcon />}
      >
        <span className="text-base font-semibold text-white leading-none">
          {tradeQuantity}
        </span>
      </InfoCardLayout>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default async function PiecePage({
  params,
}: {
  params: Promise<{ pieceUuid: string }>;
}) {
  const param = await params;
  const data = await getPieceProducts(param.pieceUuid);

  return (
    <>
      <Script
        id="piece-product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generatePieceProductJsonLd({
              name: data.productName,
              description: data.description,
              image: data.images[0]?.imageUrl || '',
              url: `https://pieceofcake.site/piece/${param.pieceUuid}`,
              price: data.piece.closingPrice || 0,
              priceCurrency: 'KRW',
              category: data.mainCategory.categoryName,
              availability: data.piece.isTrading
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              piecePrice: data.piece.closingPrice || 0,
              totalPieces: data.piece.tradeQuantity,
              availablePieces: data.piece.tradeQuantity,
            })
          ),
        }}
      />
      <PageWrapper>
        <Header isAlert={false} />
        <div>
          <ArtworkCard
            imageUrl={data.images[0]?.imageUrl || '/example.png'}
            title={data.productName}
          />
        </div>
        <InfoCards
          closingPrice={data.piece.closingPrice}
          tradeQuantity={data.piece.tradeQuantity}
        />
        <TabLayout tabs={['Details', 'Owners', '호가', 'History']}>
          <div>{data.description}</div>
          <div>소유자 정보가 여기에 표시됩니다.</div>
          <div>
            <OrderBook pieceUuid={param.pieceUuid} />
          </div>
          <div>
            <OrderHistory pieceUuid={param.pieceUuid} />
          </div>
        </TabLayout>

        {/* 댓글 섹션 */}
        <div className="mt-8">
          <CommentSection type="PIECE" productUuid={param.pieceUuid} />
        </div>
      </PageWrapper>
    </>
  );
}
