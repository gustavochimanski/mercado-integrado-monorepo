import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrlFromRequest } from "@cardapio/lib/api/getApiBaseUrl.middleware";

const TENANT_COOKIE_NAME = "tenant_slug";

/** Rotas que não são tenant (primeiro segmento do path) */
const KNOWN_FIRST_SEGMENTS = [
  "api",
  "categoria",
  "landingpage-store",
  "finalizar-pedido",
  "menu",
  "pedidos",
  "_next",
  "favicon.ico",
];

function isValidTenantSlug(s: string): boolean {
  return /^[a-z0-9-]+$/.test(s.trim().toLowerCase());
}

/**
 * 1) /teste2?empresa=3 → seta cookie tenant_slug=teste2 e reescreve para /?empresa=3
 * 2) /?empresa=X → redirect para landingpage-store se empresa.landingpage_store === true
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);

  // /teste2 ou /outro-tenant → setar tenant_slug e reescrever para / (preservando query)
  if (segments.length === 1 && !KNOWN_FIRST_SEGMENTS.includes(segments[0])) {
    const tenant = segments[0].trim().toLowerCase();
    if (isValidTenantSlug(tenant)) {
      const rewriteUrl = new URL("/", request.url);
      request.nextUrl.searchParams.forEach((v, k) => rewriteUrl.searchParams.set(k, v));
      const res = NextResponse.rewrite(rewriteUrl);
      res.cookies.set(TENANT_COOKIE_NAME, tenant, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
      return res;
    }
  }

  if (pathname !== "/") {
    return NextResponse.next();
  }

  const empresaParam = request.nextUrl.searchParams.get("empresa")?.trim();
  if (!empresaParam || !/^\d+$/.test(empresaParam)) {
    return NextResponse.next();
  }

  const empresaId = parseInt(empresaParam, 10);
  if (!Number.isFinite(empresaId) || empresaId <= 0) {
    return NextResponse.next();
  }

  try {
    const apiBaseUrl = getApiBaseUrlFromRequest(request);
    const url = `${apiBaseUrl}/api/empresas/public/emp/lista?empresa_id=${empresaId}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.next();
    }

    const data = await res.json();
    const emp = Array.isArray(data) ? data[0] : data;

    if (emp?.landingpage_store) {
      const via = request.nextUrl.searchParams.get("via");
      const target = new URL("/landingpage-store", request.url);
      target.searchParams.set("empresa", String(empresaId));
      if (via === "supervisor") {
        target.searchParams.set("via", "supervisor");
      }
      return NextResponse.redirect(target);
    }
  } catch {
    // Em caso de erro (rede, timeout, etc.), deixa a Home tratar no client
  }

  return NextResponse.next();
}

export const config = {
  // / e /:tenant (ex.: /teste2); rotas conhecidas são filtradas no corpo do middleware
  matcher: ["/", "/:tenant"],
};
