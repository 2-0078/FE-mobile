/**
 * OG 이미지 URL 생성 유틸리티
 */

export interface OGImageConfig {
  title: string;
  subtitle?: string;
  price?: number;
  category?: string;
  status?: string;
  type: 'main' | 'funding' | 'piece' | 'search' | 'category';
}

/**
 * 기본 OG 이미지 URL 생성
 */
export function generateOGImageUrl(config: OGImageConfig): string {
  const baseUrl = 'https://pieceofcake.site';

  switch (config.type) {
    case 'main':
      return `${baseUrl}/api/og?title=${encodeURIComponent(config.title)}&subtitle=${encodeURIComponent(config.subtitle || '투자 조각 구매 플랫폼')}`;

    case 'funding':
      return `${baseUrl}/api/og/funding?title=${encodeURIComponent(config.title)}&price=${config.price || 0}&category=${encodeURIComponent(config.category || '')}&status=${encodeURIComponent(config.status || '')}`;

    case 'piece':
      return `${baseUrl}/api/og/piece?title=${encodeURIComponent(config.title)}&price=${config.price || 0}&category=${encodeURIComponent(config.category || '')}`;

    case 'search':
      return `${baseUrl}/api/og/search?title=${encodeURIComponent(config.title)}&subtitle=${encodeURIComponent(config.subtitle || '검색 결과')}`;

    case 'category':
      return `${baseUrl}/api/og/category?title=${encodeURIComponent(config.title)}&subtitle=${encodeURIComponent(config.subtitle || '카테고리')}`;

    default:
      return `${baseUrl}/og-image.png`;
  }
}

/**
 * 상품별 OG 이미지 URL 생성
 */
export function generateProductOGImageUrl(
  productName: string,
  price: number,
  category: string,
  type: 'funding' | 'piece'
): string {
  const baseUrl = 'https://pieceofcake.site';

  if (type === 'funding') {
    return `${baseUrl}/api/og/funding?title=${encodeURIComponent(productName)}&price=${price}&category=${encodeURIComponent(category)}`;
  } else {
    return `${baseUrl}/api/og/piece?title=${encodeURIComponent(productName)}&price=${price}&category=${encodeURIComponent(category)}`;
  }
}

/**
 * 검색 결과 OG 이미지 URL 생성
 */
export function generateSearchOGImageUrl(
  searchTerm: string,
  totalResults: number
): string {
  const baseUrl = 'https://pieceofcake.site';
  return `${baseUrl}/api/og/search?title=${encodeURIComponent(searchTerm)}&subtitle=${encodeURIComponent(`${totalResults}개의 검색 결과`)}`;
}

/**
 * 카테고리 OG 이미지 URL 생성
 */
export function generateCategoryOGImageUrl(
  category: string,
  subCategory?: string
): string {
  const baseUrl = 'https://pieceofcake.site';
  const title = subCategory ? `${category} - ${subCategory}` : category;
  return `${baseUrl}/api/og/category?title=${encodeURIComponent(title)}`;
}

/**
 * OG 이미지 메타데이터 생성
 */
export function generateOGImageMetadata(
  title: string,
  description: string,
  imageUrl: string,
  type: 'website' | 'article' | 'product' = 'website'
) {
  return {
    'og:title': title,
    'og:description': description,
    'og:image': imageUrl,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',
    'og:image:alt': title,
    'og:type': type,
    'og:site_name': 'Piece of Cake',
    'og:locale': 'ko_KR',
    'og:locale:alternate': 'en_US',
    'og:country_name': 'South Korea',
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': imageUrl,
    'twitter:site': '@pieceofcake',
    'twitter:creator': '@pieceofcake',
  };
}
