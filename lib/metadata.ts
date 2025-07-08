import { Metadata } from 'next';

export interface ProductMetadata {
  title: string;
  description: string;
  price?: number;
  category?: string;
  imageUrl?: string;
}

export interface FundingMetadata extends ProductMetadata {
  remainingPieces?: number;
  totalPieces?: number;
  fundingStatus?: string;
}

export interface PieceMetadata extends ProductMetadata {
  piecePrice?: number;
  totalPieces?: number;
  availablePieces?: number;
}

/**
 * 기본 메타데이터 생성
 */
export function generateBaseMetadata(
  title: string,
  description: string,
  keywords: string[] = [],
  url: string = '/'
): Metadata {
  return {
    title,
    description,
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
      ...keywords,
    ],
    openGraph: {
      title: `${title} | Piece of Cake`,
      description,
      url: `https://pieceofcake.site${url}`,
      siteName: 'Piece of Cake',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Piece of Cake`,
      description,
      images: ['/og-image.png'],
    },
  };
}

/**
 * 펀딩 상품 상세 페이지 메타데이터 생성
 */
export function generateFundingMetadata(
  funding: FundingMetadata,
  fundingUuid: string
): Metadata {
  const {
    title,
    description,
    price,
    category,
    imageUrl,
    remainingPieces,
    totalPieces,
  } = funding;

  const fullDescription = `${description} ${price ? `가격: ${price.toLocaleString()}원` : ''} ${remainingPieces && totalPieces ? `남은 조각: ${remainingPieces}/${totalPieces}` : ''}`;

  return {
    title,
    description: fullDescription,
    keywords: [
      '펀딩',
      '투자',
      category || '자산',
      '조각투자',
      '크라우드펀딩',
      ...(price ? ['투자상품'] : []),
    ],
    openGraph: {
      title: `${title} | Piece of Cake`,
      description: fullDescription,
      url: `https://pieceofcake.site/funding/${fundingUuid}`,
      siteName: 'Piece of Cake',
      images: [
        {
          url: imageUrl || 'https://pieceofcake.site/og-funding-detail.png',
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
        {
          url:
            imageUrl || 'https://pieceofcake.site/og-funding-detail-square.png',
          width: 600,
          height: 600,
          alt: title,
          type: 'image/png',
        },
      ],
      locale: 'ko_KR',
      type: 'website',
      countryName: 'South Korea',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Piece of Cake`,
      description: fullDescription,
      images: [imageUrl || '/og-image.png'],
    },
  };
}

/**
 * 조각 상품 상세 페이지 메타데이터 생성
 */
export function generatePieceMetadata(
  piece: PieceMetadata,
  pieceUuid: string
): Metadata {
  const {
    title,
    description,
    category,
    imageUrl,
    piecePrice,
    totalPieces,
    availablePieces,
  } = piece;

  const fullDescription = `${description} ${piecePrice ? `조각 가격: ${piecePrice.toLocaleString()}원` : ''} ${availablePieces && totalPieces ? `구매 가능 조각: ${availablePieces}/${totalPieces}` : ''}`;

  return {
    title,
    description: fullDescription,
    keywords: [
      '조각투자',
      '투자',
      category || '자산',
      '부동산',
      '예술품',
      '스타트업',
      ...(piecePrice ? ['조각상품'] : []),
    ],
    openGraph: {
      title: `${title} | Piece of Cake`,
      description: fullDescription,
      url: `https://pieceofcake.site/piece/${pieceUuid}`,
      siteName: 'Piece of Cake',
      images: [
        {
          url: imageUrl || 'https://pieceofcake.site/og-piece-detail.png',
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
        {
          url:
            imageUrl || 'https://pieceofcake.site/og-piece-detail-square.png',
          width: 600,
          height: 600,
          alt: title,
          type: 'image/png',
        },
      ],
      locale: 'ko_KR',
      type: 'website',
      countryName: 'South Korea',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Piece of Cake`,
      description: fullDescription,
      images: [imageUrl || '/og-image.png'],
    },
  };
}

/**
 * 검색 결과 페이지 메타데이터 생성
 */
export function generateSearchMetadata(
  searchTerm: string,
  category?: string,
  totalResults?: number
): Metadata {
  const title = `"${searchTerm}" 검색 결과`;
  const description = `${searchTerm}에 대한 ${totalResults ? `${totalResults}개의 ` : ''}검색 결과를 확인하세요. ${category ? `${category} 카테고리에서 ` : ''}다양한 투자 기회를 발견하세요.`;

  return {
    title,
    description,
    keywords: [
      searchTerm,
      '검색',
      '투자',
      '조각투자',
      category || '자산',
      '부동산',
      '예술품',
      '스타트업',
    ],
    openGraph: {
      title: `${title} | Piece of Cake`,
      description,
      url: `https://pieceofcake.site/search?q=${encodeURIComponent(searchTerm)}`,
      siteName: 'Piece of Cake',
      images: [
        {
          url: 'https://pieceofcake.site/og-search.png',
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
        {
          url: 'https://pieceofcake.site/og-search-square.png',
          width: 600,
          height: 600,
          alt: title,
          type: 'image/png',
        },
      ],
      locale: 'ko_KR',
      type: 'website',
      countryName: 'South Korea',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Piece of Cake`,
      description,
      images: ['https://pieceofcake.site/og-search.png'],
    },
  };
}

/**
 * 카테고리 페이지 메타데이터 생성
 */
export function generateCategoryMetadata(
  category: string,
  subCategory?: string,
  totalProducts?: number
): Metadata {
  const title = subCategory ? `${category} - ${subCategory}` : category;
  const description = `${title} 카테고리에서 ${totalProducts ? `${totalProducts}개의 ` : ''}다양한 투자 상품을 발견하세요. 안전하고 수익성 있는 투자 기회를 제공합니다.`;

  return {
    title,
    description,
    keywords: [
      category,
      subCategory,
      '투자',
      '조각투자',
      '부동산',
      '예술품',
      '스타트업',
      '크라우드펀딩',
    ].filter((keyword): keyword is string => Boolean(keyword)),
    openGraph: {
      title: `${title} | Piece of Cake`,
      description,
      url: `https://pieceofcake.site/category/${encodeURIComponent(category)}${subCategory ? `/${encodeURIComponent(subCategory)}` : ''}`,
      siteName: 'Piece of Cake',
      images: [
        {
          url: 'https://pieceofcake.site/og-category.png',
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
        {
          url: 'https://pieceofcake.site/og-category-square.png',
          width: 600,
          height: 600,
          alt: title,
          type: 'image/png',
        },
      ],
      locale: 'ko_KR',
      type: 'website',
      countryName: 'South Korea',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Piece of Cake`,
      description,
      images: ['https://pieceofcake.site/og-category.png'],
    },
  };
}
