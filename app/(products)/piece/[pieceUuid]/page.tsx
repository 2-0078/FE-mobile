import React from 'react';
import { Metadata } from 'next';
import { getPieceProducts } from '@/action/product-service';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import PieceDetailClient from '@/components/common/PieceDetailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pieceUuid: string }>;
}): Promise<Metadata> {
  try {
    const { pieceUuid } = await params;
    const piece = await getPieceProducts(pieceUuid);
    if (!piece) {
      return {
        title: '상품을 찾을 수 없습니다',
        description: '요청하신 상품을 찾을 수 없습니다.',
      };
    }

    return {
      title: `${piece.productName} | Piece of Cake`,
      description: piece.description || '조각 투자 상품입니다.',
      keywords: ['조각 투자', '아트 투자', '상품', '투자', piece.productName],
      openGraph: {
        title: `${piece.productName} | Piece of Cake`,
        description: piece.description || '조각 투자 상품입니다.',
        url: `https://pieceofcake.site/piece/${pieceUuid}`,
        siteName: 'Piece of Cake',
        images: [
          {
            url: piece.images[0]?.imageUrl || '/og-image.png',
            width: 1200,
            height: 630,
            alt: piece.productName,
          },
        ],
        locale: 'ko_KR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${piece.productName} | Piece of Cake`,
        description: piece.description || '조각 투자 상품입니다.',
        images: [piece.images[0]?.imageUrl || '/og-image.png'],
      },
    };
  } catch {
    return {
      title: '상품을 찾을 수 없습니다',
      description: '요청하신 상품을 찾을 수 없습니다.',
    };
  }
}

export default async function PiecePage({
  params,
}: {
  params: Promise<{ pieceUuid: string }>;
}) {
  try {
    const { pieceUuid } = await params;
    const piece = await getPieceProducts(pieceUuid);
    if (!piece) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        <Header
          title={piece.productName}
          isAlert={false}
          isCloseButton={true}
        />
        <PieceDetailClient piece={piece} />
      </div>
    );
  } catch {
    notFound();
  }
}
