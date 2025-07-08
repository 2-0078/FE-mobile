import { Metadata } from 'next';
import SignupSteps from '@/components/(auth)/SignupSteps';

export const metadata: Metadata = {
  title: '회원가입',
  description:
    'Piece of Cake에 가입하고 다양한 투자 기회를 발견하세요. 안전하고 편리한 투자 플랫폼을 경험해보세요.',
  keywords: [
    '회원가입',
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
    title: '회원가입 | Piece of Cake',
    description: 'Piece of Cake에 가입하고 다양한 투자 기회를 발견하세요.',
    url: 'https://pieceofcake.site/signup',
    siteName: 'Piece of Cake',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Piece of Cake - 회원가입',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '회원가입 | Piece of Cake',
    description: 'Piece of Cake에 가입하고 다양한 투자 기회를 발견하세요.',
    images: ['/og-image.png'],
  },
};

export default function SignupPage() {
  return <SignupSteps />;
}
