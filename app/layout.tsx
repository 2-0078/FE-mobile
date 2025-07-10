import type { Metadata } from 'next';
import './globals.css';
import AlertProvider from '@/lib/Alert/AlertProvider';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: {
    default: 'Piece of Cake - 투자 조각 구매 플랫폼',
    template: '%s | Piece of Cake',
  },
  description:
    'Piece of Cake는 부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자할 수 있는 플랫폼입니다. 소액으로도 고가 자산에 투자하고 수익을 창출하세요.',
  keywords: [
    '투자',
    '조각투자',
    '부동산',
    '예술품',
    '스타트업',
    '크라우드펀딩',
    'P2P',
    '금융',
    '자산관리',
  ],
  authors: [{ name: 'Piece of Cake Team' }],
  creator: 'Piece of Cake',
  publisher: 'Piece of Cake',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://pieceofcake.site'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Piece of Cake - 투자 조각 구매 플랫폼',
    description:
      '부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자할 수 있는 플랫폼',
    url: 'https://pieceofcake.site',
    siteName: 'Piece of Cake',
    images: [
      {
        url: 'https://pieceofcake.site/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Piece of Cake - 투자 조각 구매 플랫폼',
        type: 'image/png',
      },
      {
        url: 'https://pieceofcake.site/og-image-square.png',
        width: 600,
        height: 600,
        alt: 'Piece of Cake - 투자 조각 구매 플랫폼',
        type: 'image/png',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
    countryName: 'South Korea',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Piece of Cake - 투자 조각 구매 플랫폼',
    description:
      '부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자할 수 있는 플랫폼',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      'index': true,
      'follow': true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ko">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#22c55e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Piece of Cake" />
        <meta name="msapplication-TileColor" content="#22c55e" />
        <meta name="application-name" content="Piece of Cake" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* 추가 OG 태그 */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:country_name" content="South Korea" />

        {/* Facebook */}
        <meta property="fb:app_id" content="your-facebook-app-id" />
        <meta property="fb:pages" content="your-facebook-page-id" />

        {/* Twitter 추가 */}
        <meta name="twitter:site" content="@pieceofcake" />
        <meta name="twitter:creator" content="@pieceofcake" />

        {/* LinkedIn */}
        <meta property="linkedin:owner" content="pieceofcake" />

        {/* Pinterest */}
        <meta name="pinterest-rich-pin" content="true" />

        {/* 추가 소셜 미디어 */}
        <meta
          property="og:image:secure_url"
          content="https://pieceofcake.site/og-image.png"
        />
        <meta
          property="og:image:alt"
          content="Piece of Cake - 투자 조각 구매 플랫폼"
        />
      </head>
      <body className="antialiased font-pretendard">
        <SessionProvider session={session}>
          <AlertProvider>{children}</AlertProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
