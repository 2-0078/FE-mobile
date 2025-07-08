import React from 'react';
import Script from 'next/script';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: object;
  canonical?: string;
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  jsonLd,
  canonical,
}: SEOHeadProps) {
  const fullTitle = title
    ? `${title} | Piece of Cake`
    : 'Piece of Cake - 투자 조각 구매 플랫폼';
  const fullDescription =
    description ||
    'Piece of Cake는 부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자할 수 있는 플랫폼입니다.';
  const fullImage = image || '/og-image.png';
  const fullUrl = url || 'https://pieceofcake.site';

  return (
    <>
      {/* 기본 메타 태그 */}
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Piece of Cake" />
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:country_name" content="South Korea" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@pieceofcake" />
      <meta name="twitter:creator" content="@pieceofcake" />

      {/* Facebook */}
      <meta property="fb:app_id" content="your-facebook-app-id" />
      <meta property="fb:pages" content="your-facebook-page-id" />

      {/* LinkedIn */}
      <meta property="linkedin:owner" content="pieceofcake" />

      {/* Pinterest */}
      <meta name="pinterest-rich-pin" content="true" />

      {/* 추가 메타 태그 */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Piece of Cake Team" />
      <meta name="copyright" content="Piece of Cake" />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* JSON-LD 구조화된 데이터 */}
      {jsonLd && (
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}
    </>
  );
}
