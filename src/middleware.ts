import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "portfolio-pro-super-secret-key-change-in-production-2026",
    });

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("callbackUrl", pathname);
      const res = NextResponse.redirect(url);
      addSecurityHeaders(res);
      return res;
    }

    const userRole = (token.role as string) || "";

    // Role-based route authorization
    if (pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("error", "AccessDeniedAdminOnly");
      const res = NextResponse.redirect(url);
      addSecurityHeaders(res);
      return res;
    }

    if (pathname.startsWith("/dashboard/advisor") && userRole !== "ADVISOR" && userRole !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("error", "AccessDeniedAdvisorOnly");
      const res = NextResponse.redirect(url);
      addSecurityHeaders(res);
      return res;
    }

    if (pathname.startsWith("/dashboard/investor") && userRole !== "INVESTOR" && userRole !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("error", "AccessDeniedInvestorOnly");
      const res = NextResponse.redirect(url);
      addSecurityHeaders(res);
      return res;
    }
  }

  // Protect Admin API routes
  if (pathname.startsWith("/api/admin")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "portfolio-pro-super-secret-key-change-in-production-2026",
    });

    if (!token || token.role !== "ADMIN") {
      const res = NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
      addSecurityHeaders(res);
      return res;
    }
  }

  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/admin/:path*",
  ],
};

