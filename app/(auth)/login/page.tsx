import { Metadata } from 'next';
import LoginSection from '@/components/organisms/LoginSection';

export const metadata: Metadata = {
  title: '로그인',
  description:
    'Piece of Cake에 로그인하고 다양한 투자 기회를 발견하세요. 안전하고 편리한 투자 플랫폼을 경험해보세요.',
  keywords: [
    '로그인',
    '투자',
    '조각투자',
    '부동산',
    '예술품',
    '스타트업',
    '크라우드펀딩',
    'P2P',
    '금융',
  ],
  openGraph: {
    title: '로그인 | Piece of Cake',
    description: 'Piece of Cake에 로그인하고 다양한 투자 기회를 발견하세요.',
    url: 'https://pieceofcake.site/login',
    siteName: 'Piece of Cake',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Piece of Cake - 로그인',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '로그인 | Piece of Cake',
    description: 'Piece of Cake에 로그인하고 다양한 투자 기회를 발견하세요.',
    images: ['/og-image.png'],
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  return <LoginSection searchParams={resolvedSearchParams} />;
}
