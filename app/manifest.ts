import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Piece of Cake - 투자 조각 구매 플랫폼',
    short_name: 'Piece of Cake',
    description:
      '부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자할 수 있는 플랫폼',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#22c55e',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['finance', 'business', 'lifestyle'],
    lang: 'ko',
    dir: 'ltr',
    orientation: 'portrait',
    scope: '/',
    prefer_related_applications: false,
  };
}
