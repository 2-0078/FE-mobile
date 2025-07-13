import React from 'react';
import { Metadata } from 'next';
import Script from 'next/script';
import { getPieceProducts } from '@/action/product-service';
import PageWrapper from '@/components/layout/PageWrapper';
import TabLayout from '@/components/layout/TabLayout';
import { generatePieceMetadata } from '@/lib/metadata';
import { generatePieceProductJsonLd } from '@/lib/structured-data';
import OrderBook from '@/components/common/OrderBook';
import OrderHistory from '@/components/common/OrderHistory';
import PieceDetailClient from '@/components/common/PieceDetailClient';
import { PieceChart } from '@/components/common/PieceChart';
import PieceDetailCard from '@/components/common/PieceDetailCard';

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
      <PieceDetailClient
        pieceUuid={param.pieceUuid}
        productUuid={data.productUuid}
        productData={data}
      >
        <PageWrapper>
          <div className="space-y-3 pt-20">
            <PieceDetailCard product={data} />
          </div>

          {/* 차트 섹션 - 모바일 최적화 */}
          <div className="mt-4">
            <PieceChart pieceUuid={param.pieceUuid} />
          </div>

          <TabLayout tabs={['호가', 'details', 'History']}>
            <div>
              <OrderBook pieceUuid={param.pieceUuid} />
            </div>
            <div className="text-sm text-gray-300 leading-relaxed">
              {data.description}
            </div>
            {/* <div className="text-sm text-gray-300">
              소유자 정보가 여기에 표시됩니다.
            </div> */}
            <div>
              <OrderHistory pieceUuid={param.pieceUuid} />
            </div>
          </TabLayout>
        </PageWrapper>
      </PieceDetailClient>
    </>
  );
}
