// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@supervisor/lib/auth/middlewareAuth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar caminhos públicos
  const publicPaths = ["/login", "/_next", "/api", "/favicon.ico"];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path)) || pathname.match(/\..+$/);

  if (isPublic) {
    return NextResponse.next();
  }

  // Verificar token e tempo restante
  const tokenValidation = validateToken(request);

  // Se token não é válido OU restam 60 minutos ou menos (29 min de uso), redirecionar para login
  if (!tokenValidation.isValid || tokenValidation.timeUntilExpiry <= 3600) { // 60 min restantes = 29 min de uso
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se deve mostrar reauth (20 minutos ou menos), adicionar header especial
  if (tokenValidation.shouldShowReauth) {
    const response = NextResponse.next();
    response.headers.set('x-require-reauth', 'true');
    response.headers.set('x-time-until-expiry', tokenValidation.timeUntilExpiry.toString());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|login|.*\\..*).*)"],
};
