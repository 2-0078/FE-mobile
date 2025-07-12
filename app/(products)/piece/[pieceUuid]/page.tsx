import React from 'react';
import { Metadata } from 'next';
import { getPieceProduct } from '@/action/product-service';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import PieceDetailClient from '@/components/common/PieceDetailClient';
import { PieceProductType } from '@/types/ProductTypes';

export async function generateMetadata({
  params,
}: {
  params: { pieceUuid: string };
}): Promise<Metadata> {
  try {
    const piece = await getPieceProduct(params.pieceUuid);
    if (!piece) {
      return {
        title: '상품을 찾을 수 없습니다',
        description: '요청하신 상품을 찾을 수 없습니다.',
      };
    }

    return {
      title: `${piece.product.productName} | Piece of Cake`,
      description: piece.product.description || '조각 투자 상품입니다.',
      keywords: [
        '조각 투자',
        '아트 투자',
        '상품',
        '투자',
        piece.product.productName,
      ],
      openGraph: {
        title: `${piece.product.productName} | Piece of Cake`,
        description: piece.product.description || '조각 투자 상품입니다.',
        url: `https://pieceofcake.site/piece/${params.pieceUuid}`,
        siteName: 'Piece of Cake',
        images: [
          {
            url: piece.product.mainImage || '/og-image.png',
            width: 1200,
            height: 630,
            alt: piece.product.productName,
          },
        ],
        locale: 'ko_KR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${piece.product.productName} | Piece of Cake`,
        description: piece.product.description || '조각 투자 상품입니다.',
        images: [piece.product.mainImage || '/og-image.png'],
      },
    };
  } catch (error) {
    return {
      title: '상품을 찾을 수 없습니다',
      description: '요청하신 상품을 찾을 수 없습니다.',
    };
  }
}

export default async function PiecePage({
  params,
}: {
  params: { pieceUuid: string };
}) {
  try {
    const piece = await getPieceProduct(params.pieceUuid);
    if (!piece) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        <Header
          title={piece.product.productName}
          isAlert={false}
          isCloseButton={true}
        />
        <PieceDetailClient piece={piece} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch piece product:', error);
    notFound();
  }
}
