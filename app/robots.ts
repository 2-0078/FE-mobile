import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/', '/_next/', '/favicon.ico'],
      },
    ],
    sitemap: 'https://pieceofcake.site/sitemap.xml',
  };
}
