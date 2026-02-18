import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for protecting routes
 * 
 * Note: We use a simple cookie check here instead of NextAuth's auth() function
 * to avoid Edge Runtime compatibility issues with Node.js modules (crypto, Prisma, etc.)
 * 
 * The actual authentication verification happens in API routes and pages using
 * the auth() function from @/auth, which runs in Node.js runtime.
 */
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Protected routes
  const protectedRoutes = ["/library", "/profile", "/settings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for NextAuth v5 session cookie
    // NextAuth v5 uses these cookie names (check both http and secure variants)
    const sessionToken = 
      req.cookies.get("authjs.session-token")?.value ||
      req.cookies.get("__Secure-authjs.session-token")?.value ||
      req.cookies.get("next-auth.session-token")?.value ||
      req.cookies.get("__Secure-next-auth.session-token")?.value;
    
    if (!sessionToken) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
