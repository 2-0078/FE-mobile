export interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  contactPoint?: {
    telephone: string;
    contactType: string;
  };
  sameAs?: string[];
}

export interface ProductData {
  name: string;
  description: string;
  image: string;
  url: string;
  price?: number;
  priceCurrency?: string;
  category?: string;
  availability?: string;
}

export interface FundingProductData extends ProductData {
  remainingPieces?: number;
  totalPieces?: number;
  fundingStatus?: string;
}

export interface PieceProductData extends ProductData {
  piecePrice?: number;
  totalPieces?: number;
  availablePieces?: number;
}

/**
 * 조직 정보 JSON-LD 생성
 */
export function generateOrganizationJsonLd(data: OrganizationData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': data.name,
    'url': data.url,
    'logo': data.logo,
    'description': data.description,
    ...(data.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        'telephone': data.contactPoint.telephone,
        'contactType': data.contactPoint.contactType,
      },
    }),
    ...(data.sameAs && { sameAs: data.sameAs }),
  };
}

/**
 * 웹사이트 정보 JSON-LD 생성
 */
export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Piece of Cake',
    'url': 'https://pieceofcake.site',
    'description':
      '부동산, 예술품, 스타트업 등 다양한 자산을 조각으로 나누어 투자할 수 있는 플랫폼',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://pieceofcake.site/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 펀딩 상품 JSON-LD 생성
 */
export function generateFundingProductJsonLd(data: FundingProductData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': data.name,
    'description': data.description,
    'image': data.image,
    'url': data.url,
    ...(data.price && {
      offers: {
        '@type': 'Offer',
        'price': data.price,
        'priceCurrency': data.priceCurrency || 'KRW',
        'availability': data.availability || 'https://schema.org/InStock',
        'seller': {
          '@type': 'Organization',
          'name': 'Piece of Cake',
        },
      },
    }),
    ...(data.category && { category: data.category }),
    ...(data.remainingPieces &&
      data.totalPieces && {
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            'name': 'remainingPieces',
            'value': data.remainingPieces,
          },
          {
            '@type': 'PropertyValue',
            'name': 'totalPieces',
            'value': data.totalPieces,
          },
        ],
      }),
    ...(data.fundingStatus && {
      additionalProperty: {
        '@type': 'PropertyValue',
        'name': 'fundingStatus',
        'value': data.fundingStatus,
      },
    }),
  };
}

/**
 * 조각 상품 JSON-LD 생성
 */
export function generatePieceProductJsonLd(data: PieceProductData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': data.name,
    'description': data.description,
    'image': data.image,
    'url': data.url,
    ...(data.piecePrice && {
      offers: {
        '@type': 'Offer',
        'price': data.piecePrice,
        'priceCurrency': data.priceCurrency || 'KRW',
        'availability': data.availability || 'https://schema.org/InStock',
        'seller': {
          '@type': 'Organization',
          'name': 'Piece of Cake',
        },
      },
    }),
    ...(data.category && { category: data.category }),
    ...(data.availablePieces &&
      data.totalPieces && {
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            'name': 'availablePieces',
            'value': data.availablePieces,
          },
          {
            '@type': 'PropertyValue',
            'name': 'totalPieces',
            'value': data.totalPieces,
          },
        ],
      }),
  };
}

/**
 * 검색 결과 페이지 JSON-LD 생성
 */
export function generateSearchResultsJsonLd(
  searchTerm: string,
  totalResults: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    'name': `"${searchTerm}" 검색 결과`,
    'description': `${searchTerm}에 대한 ${totalResults}개의 검색 결과`,
    'url': `https://pieceofcake.site/search?q=${encodeURIComponent(searchTerm)}`,
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': totalResults,
      'name': `"${searchTerm}" 검색 결과`,
    },
  };
}

/**
 * FAQ 페이지 JSON-LD 생성
 */
export function generateFAQJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };
}

/**
 * 브레드크럼 JSON-LD 생성
 */
export function generateBreadcrumbJsonLd(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': breadcrumb.name,
      'item': breadcrumb.url,
    })),
  };
}
