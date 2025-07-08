import { auth } from '@/auth';

// 로그인이 필요한 페이지 목록
const protectedRoutes = [
  '/mywallet',
  '/my-products',
  '/profile',
  '/settings',
  '/sell',
  '/charge',
  '/withdraw',
  '/cart',
  '/mypage',
];

// 공개 페이지 목록 (로그인 없이 접근 가능)
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/notice',
  '/event',
  '/faq',
  '/contact',
  '/other',
  '/funding',
  '/piece',
];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // 로그인이 필요한 페이지에 비로그인 상태로 접근하는 경우
  if (
    !isLoggedIn &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const callbackUrl = encodeURIComponent(pathname);
    const loginUrl = new URL(
      `/login?callbackUrl=${callbackUrl}`,
      nextUrl.origin
    );
    return Response.redirect(loginUrl);
  }

  // 이미 로그인된 상태에서 로그인/회원가입 페이지에 접근하는 경우
  if (isLoggedIn && (pathname === '/login' || pathname === '/signup')) {
    return Response.redirect(new URL('/', nextUrl.origin));
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - fonts (font files)
     * - images (image files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)',
  ],
};
