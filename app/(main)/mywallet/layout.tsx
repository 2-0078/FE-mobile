import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '내 자산',
  description:
    'Piece of Cake에서 내 자산을 관리하세요. 보유 조각, 참여 공모, 찜 목록, 내 경매, 예치금 사용 내역, 내 구매 상품을 한눈에 확인하세요.',
  keywords: [
    '내 자산',
    '보유 조각',
    '참여 공모',
    '찜 목록',
    '내 경매',
    '예치금',
    '구매 상품',
    '투자',
    '자산관리',
  ],
  openGraph: {
    title: '내 자산 | Piece of Cake',
    description:
      '보유 조각, 참여 공모, 찜 목록, 내 경매, 예치금 사용 내역, 내 구매 상품을 한눈에 확인하세요.',
    url: 'https://pieceofcake.site/mywallet',
    siteName: 'Piece of Cake',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Piece of Cake - 내 자산',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '내 자산 | Piece of Cake',
    description:
      '보유 조각, 참여 공모, 찜 목록, 내 경매, 예치금 사용 내역, 내 구매 상품을 한눈에 확인하세요.',
    images: ['/og-image.png'],
  },
};

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
