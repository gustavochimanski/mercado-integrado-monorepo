// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar caminhos públicos
  const publicPaths = ["/login", "/_next", "/api", "/favicon.ico"];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path)) || pathname.match(/\..+$/);

  if (isPublic) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|login|.*\\..*).*)"],
};
