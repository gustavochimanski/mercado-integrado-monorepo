"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";

const TENANT_COOKIE_NAME = "tenant_slug";
const API_BASE_URL_COOKIE_NAME = "api_base_url";

// "Para sempre" na prática: prazo bem longo (10 anos).
const PERSISTENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 * 10;

function normalizeTenantSlug(value: unknown): string | null {
  const slug = (typeof value === "string" ? value : "").trim().toLowerCase();
  if (!slug) return null;
  return /^[a-z0-9-]+$/.test(slug) ? slug : null;
}

function cookieOptions() {
  return {
    path: "/",
    maxAge: PERSISTENT_COOKIE_MAX_AGE_SECONDS,
    expires: new Date(Date.now() + PERSISTENT_COOKIE_MAX_AGE_SECONDS * 1000),
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

/** Mantém em sync com `src/middleware.ts` */
const KNOWN_FIRST_SEGMENTS = new Set([
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
]);

export function TenantCookiePersist() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 1) Prioridade: query param ?tenant=slug (ex.: links de supervisor)
    const tenantFromQuery = normalizeTenantSlug(searchParams.get("tenant"));

    // 2) Fallback: URL /{tenant}/... (mesma regra do middleware: primeiro segmento e não conhecido)
    const segments = (pathname ?? "").split("/").filter(Boolean);
    const maybeFromPath =
      segments.length >= 1 && !KNOWN_FIRST_SEGMENTS.has(segments[0])
        ? normalizeTenantSlug(segments[0])
        : null;

    const nextTenant = tenantFromQuery ?? maybeFromPath;
    if (!nextTenant) return;

    const current = normalizeTenantSlug(getCookie(TENANT_COOKIE_NAME));
    if (current !== nextTenant) {
      setCookie(TENANT_COOKIE_NAME, nextTenant, cookieOptions());
    }

    // Extra: se veio api_base_url na query, persistir também
    const apiBaseFromQuery = (searchParams.get("api_base_url") ?? "").trim();
    if (apiBaseFromQuery && /^https?:\/\//.test(apiBaseFromQuery)) {
      const normalized = apiBaseFromQuery.replace(/\/$/, "");
      if ((getCookie(API_BASE_URL_COOKIE_NAME) as string | undefined) !== normalized) {
        setCookie(API_BASE_URL_COOKIE_NAME, normalized, cookieOptions());
      }
    }
  }, [pathname, searchParams]);

  return null;
}

