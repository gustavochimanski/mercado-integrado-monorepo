import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrlFromRequest } from "@cardapio/lib/api/getApiBaseUrl.middleware";

const TENANT_COOKIE_NAME = "tenant_slug";
const API_BASE_URL_COOKIE_NAME = "api_base_url";

// "Para sempre" na prática: prazo bem longo (10 anos).
// Observação: alguns navegadores/políticas podem impor limites menores,
// mas isso garante que NÃO seja cookie de sessão (que some ao fechar o browser).
const PERSISTENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 10; // 10 anos
function persistentCookieExpires() {
  return new Date(Date.now() + PERSISTENT_COOKIE_MAX_AGE_SECONDS * 1000);
}

function persistentCookieOptions() {
  return {
    path: "/",
    maxAge: PERSISTENT_COOKIE_MAX_AGE_SECONDS,
    expires: persistentCookieExpires(),
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

/** Rotas que não são tenant (primeiro segmento do path) */
const KNOWN_FIRST_SEGMENTS = [
  "api",
  "login",
  "categoria",
  "perfil",
  "enderecos",
  "landingpage-store",
  "finalizar-pedido",
  "menu",
  "pedidos",
  "_next",
  "_not-found",
  "favicon.ico",
];

function isValidTenantSlug(s: string): boolean {
  return /^[a-z0-9-]+$/.test(s.trim().toLowerCase());
}

function normalizeTenantSlug(value: string | null | undefined): string | null {
  const slug = (value ?? "").trim().toLowerCase();
  if (!slug) return null;
  return isValidTenantSlug(slug) ? slug : null;
}

/**
 * 1) /teste2?empresa=3 → seta cookie tenant_slug=teste2 e reescreve para /?empresa=3
 * 2) /?empresa=X → redirect para landingpage-store se empresa.landingpage_store === true
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const tenantFromQuery = normalizeTenantSlug(request.nextUrl.searchParams.get("tenant"));
  const apiBaseFromQuery = request.nextUrl.searchParams.get("api_base_url")?.trim();

  function applyQueryCookies(res: NextResponse) {
    // Se veio tenant na query (ex.: supervisor), persistir imediatamente no server
    if (tenantFromQuery) {
      const tenantFromCookie = normalizeTenantSlug(request.cookies.get(TENANT_COOKIE_NAME)?.value);
      if (tenantFromCookie !== tenantFromQuery) {
        res.cookies.set(TENANT_COOKIE_NAME, tenantFromQuery, persistentCookieOptions());
      }
    }

    // Em dev/override: também persistir api_base_url quando vier na query
    if (apiBaseFromQuery && /^https?:\/\//.test(apiBaseFromQuery)) {
      res.cookies.set(
        API_BASE_URL_COOKIE_NAME,
        apiBaseFromQuery.replace(/\/$/, ""),
        persistentCookieOptions()
      );
    }

    return res;
  }

  // ✅ Nunca "perder" tenant ao acessar "/":
  // Se já existe tenant_slug no cookie e o usuário acessar "/" sem um tenant explícito válido na query,
  // redireciona para "/{tenant}" preservando a query string.
  // Isso evita qualquer fluxo que trate "/" como "tenant vazio" e acabe sobrescrevendo o estado.
  if (pathname === "/") {
    const tenantFromCookie = normalizeTenantSlug(request.cookies.get(TENANT_COOKIE_NAME)?.value);
    if (!tenantFromQuery && tenantFromCookie) {
      const target = new URL(`/${tenantFromCookie}`, request.url);
      request.nextUrl.searchParams.forEach((v, k) => target.searchParams.set(k, v));
      return NextResponse.redirect(target);
    }
  }

  // /{tenant}/... → setar tenant_slug e reescrever removendo o prefixo do tenant (preservando query)
  // Ex.:
  // - /teste2              -> rewrite /
  // - /teste2/categoria/12  -> rewrite /categoria/12
  if (segments.length >= 1 && !KNOWN_FIRST_SEGMENTS.includes(segments[0])) {
    const tenant = segments[0].trim().toLowerCase();
    if (isValidTenantSlug(tenant)) {
      const restPath = `/${segments.slice(1).join("/")}`.replace(/\/$/, "");
      const rewriteUrl = new URL(restPath === "/" ? "/" : restPath || "/", request.url);
      request.nextUrl.searchParams.forEach((v, k) => rewriteUrl.searchParams.set(k, v));
      const res = NextResponse.rewrite(rewriteUrl);
      res.cookies.set(TENANT_COOKIE_NAME, tenant, persistentCookieOptions());
      // api_base_url pode vir na query (dev / override)
      if (apiBaseFromQuery && /^https?:\/\//.test(apiBaseFromQuery)) {
        res.cookies.set(
          API_BASE_URL_COOKIE_NAME,
          apiBaseFromQuery.replace(/\/$/, ""),
          persistentCookieOptions()
        );
      }
      return res;
    }
  }

  if (pathname !== "/") {
    return applyQueryCookies(NextResponse.next());
  }

  const empresaParam = request.nextUrl.searchParams.get("empresa")?.trim();
  if (!empresaParam || !/^\d+$/.test(empresaParam)) {
    return applyQueryCookies(NextResponse.next());
  }

  const empresaId = parseInt(empresaParam, 10);
  if (!Number.isFinite(empresaId) || empresaId <= 0) {
    return applyQueryCookies(NextResponse.next());
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
      return applyQueryCookies(NextResponse.next());
    }

    const data = await res.json();
    const emp = Array.isArray(data) ? data[0] : data;

    if (emp?.landingpage_store) {
      const via = request.nextUrl.searchParams.get("via");
      const tenantFromQuery = request.nextUrl.searchParams.get("tenant")?.trim()?.toLowerCase();
      const target = new URL("/landingpage-store", request.url);
      target.searchParams.set("empresa", String(empresaId));
      if (via === "supervisor") {
        target.searchParams.set("via", "supervisor");
      }
      if (tenantFromQuery && isValidTenantSlug(tenantFromQuery)) {
        target.searchParams.set("tenant", tenantFromQuery);
      }
      const redirectRes = NextResponse.redirect(target);
      // Supervisor envia / sem slug: seta cookie tenant da query no redirect para o client ter na landing
      if (tenantFromQuery && isValidTenantSlug(tenantFromQuery)) {
        redirectRes.cookies.set(TENANT_COOKIE_NAME, tenantFromQuery, persistentCookieOptions());
      }
      return redirectRes;
    }
  } catch {
    // Em caso de erro (rede, timeout, etc.), deixa a Home tratar no client
  }

  return applyQueryCookies(NextResponse.next());
}

export const config = {
  // Rodar em praticamente todas as rotas (inclui deep links /{tenant}/...).
  // Exclui apenas assets internos do Next e favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
