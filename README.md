This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## SEO 설정

이 프로젝트는 Next.js의 메타데이터 API를 사용하여 SEO를 최적화했습니다.

### 주요 SEO 기능

1. **동적 메타데이터**: 각 페이지별로 적절한 title, description, keywords 설정
2. **Open Graph**: 소셜 미디어 공유 시 최적화된 미리보기
3. **Twitter Cards**: 트위터 공유 시 최적화된 카드
4. **JSON-LD 구조화된 데이터**: 검색 엔진이 콘텐츠를 더 잘 이해할 수 있도록 구조화된 데이터 제공
5. **Sitemap**: 자동 생성되는 sitemap.xml
6. **Robots.txt**: 검색 엔진 크롤링 가이드라인

### 메타데이터 파일 구조

- `app/layout.tsx`: 루트 레이아웃 메타데이터
- `lib/metadata.ts`: 메타데이터 생성 유틸리티 함수들
- `lib/structured-data.ts`: JSON-LD 구조화된 데이터 생성 함수들
- `app/sitemap.ts`: 자동 생성되는 sitemap
- `app/robots.ts`: robots.txt 설정
- `app/manifest.ts`: PWA manifest 설정

### 페이지별 메타데이터

- **메인 페이지**: 투자 플랫폼 소개 및 키워드
- **펀딩 페이지**: 펀딩 상품 목록 및 카테고리별 최적화
- **조각 페이지**: 조각 투자 상품 목록 및 최적화
- **상품 상세 페이지**: 개별 상품 정보 및 가격 정보
- **로그인/회원가입**: 인증 관련 페이지 최적화
- **마이월렛**: 사용자 자산 관리 페이지

### 검색 키워드

주요 검색 키워드로는 다음을 포함합니다:

- 투자, 조각투자, 부동산, 예술품, 스타트업
- 크라우드펀딩, P2P, 금융, 자산관리
- 펀딩, 조각상품, 투자플랫폼

### 추가 설정

- 한국어 로케일 설정 (`lang="ko"`)
- 모바일 최적화 메타 태그
- PWA 지원을 위한 manifest 설정
- 구조화된 데이터를 통한 검색 결과 향상

### OG 태그 최적화

#### 주요 OG 태그 설정

- **og:title**: 페이지 제목
- **og:description**: 페이지 설명 (160자 이내 권장)
- **og:image**: 공유 시 표시될 이미지 (1200x630px 권장)
- **og:url**: 페이지 URL
- **og:type**: 콘텐츠 타입 (website, article, product)
- **og:site_name**: 사이트 이름
- **og:locale**: 언어 설정 (ko_KR)
- **og:country_name**: 국가 설정 (South Korea)

#### 이미지 최적화

- **메인 이미지**: 1200x630px (가로형)
- **스퀘어 이미지**: 600x600px (정사각형)
- **이미지 타입**: PNG 포맷
- **이미지 URL**: 절대 경로 사용

#### 소셜 미디어별 최적화

- **Facebook**: fb:app_id, fb:pages 설정
- **Twitter**: twitter:card, twitter:site, twitter:creator 설정
- **LinkedIn**: linkedin:owner 설정
- **Pinterest**: pinterest-rich-pin 설정

#### 페이지별 OG 이미지

- **메인 페이지**: og-image.png
- **펀딩 페이지**: og-funding.png
- **조각 페이지**: og-piece.png
- **검색 결과**: og-search.png
- **카테고리**: og-category.png
- **상품 상세**: 동적 생성

#### 동적 OG 이미지 생성

- 상품별 맞춤형 OG 이미지
- 가격, 카테고리, 상태 정보 포함
- 검색 결과별 맞춤 이미지
- 카테고리별 맞춤 이미지

### Favicon 설정

Next.js App Router에서는 `app` 디렉토리 내부에 특정 파일명으로 아이콘을 배치하면 자동으로 인식됩니다.

#### 지원되는 아이콘 파일

- **`app/favicon.ico`**: 기본 favicon (16x16, 32x32, 48x48 크기 포함)
- **`app/icon.png`**: 32x32 PNG 아이콘
- **`app/apple-icon.png`**: Apple touch icon (180x180 권장)
- **`app/icon.svg`**: SVG 아이콘 (모든 크기에서 사용 가능)

#### 아이콘 생성 가이드

1. **favicon.ico**: ICO 포맷으로 16x16, 32x32, 48x48 크기 포함
2. **icon.png**: 32x32 PNG 파일
3. **apple-icon.png**: 180x180 PNG 파일 (iOS 홈 화면용)
4. **icon.svg**: 벡터 아이콘 (선택사항)

#### 브라우저 지원

- **Chrome, Firefox, Safari**: favicon.ico 자동 인식
- **iOS**: apple-icon.png 사용
- **Android**: icon.png 사용
- **모던 브라우저**: SVG 아이콘 지원
