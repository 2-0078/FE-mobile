import { auth } from "@/auth";

const withAuthList = ["/cart", "/mypage", "/mywallet"];

export default auth((req) => {
  if (!req.auth && withAuthList.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)"],
};
