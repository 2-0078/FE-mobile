import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기타',
  description: 'Piece of Cake에서 기타 기능을 이용하세요.',
  keywords: ['기타', '기타 기능', 'Piece of Cake'],
  openGraph: {
    title: '기타 | Piece of Cake',
    description: 'Piece of Cake에서 기타 기능을 이용하세요.',
    url: 'https://pieceofcake.site/other',
    siteName: 'Piece of Cake',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Piece of Cake - 기타',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '기타 | Piece of Cake',
    description: 'Piece of Cake에서 기타 기능을 이용하세요.',
    images: ['/og-image.png'],
  },
};

export default function OtherPage() {
  return (
    <div className="pb-24 px-4 space-y-4 pt-20">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">기타</h1>
        <p className="text-gray-400">기타 기능이 준비 중입니다.</p>
      </div>
    </div>
  );
}
