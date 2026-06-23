import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter (Note: In a multi-node edge environment this is per-isolate. Upstash Redis is recommended for strict production rate limiting)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const path = request.nextUrl.pathname;

  // 1. Rate Limiting for API routes
  if (path.startsWith("/api/")) {
    // Stricter limit for auth routes
    if (path.startsWith("/api/auth")) {
      const allowed = rateLimit(`auth-${ip}`, 10, 60 * 1000); // 10 reqs per minute
      if (!allowed) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
    } else {
      const allowed = rateLimit(`api-${ip}`, 100, 60 * 1000); // 100 reqs per minute
      if (!allowed) {
        return new NextResponse("Too Many Requests", { status: 429 });
      }
    }
  }

  const response = NextResponse.next();

  // 2. Content Security Policy Headers
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https: wss:;
  `.replace(/\s{2,}/g, ' ').trim();

  // Only apply CSP to HTML requests to not break API routes
  if (request.headers.get("accept")?.includes("text/html")) {
    response.headers.set("Content-Security-Policy", cspHeader);
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
