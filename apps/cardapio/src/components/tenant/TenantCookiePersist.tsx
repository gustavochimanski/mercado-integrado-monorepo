"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { clearEmpresaData, clearEmpresaId, setEmpresaId, setEmpresaData } from "@cardapio/stores/empresa/empresaStore";
import { api } from "@cardapio/app/api/api";

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

  // Attempt to persist tenant synchronously on first render to cover preview/SSR cases
  // where effects may run after other code that already tries to call the API.
  // This makes the cookie available immediately for any client-side calls that run
  // during the same render cycle (best-effort).
  if (typeof window !== "undefined") {
    try {
      const tenantFromQuerySync = normalizeTenantSlug(new URLSearchParams(window.location.search).get("tenant"));
      const segmentsSync = window.location.pathname.split("/").filter(Boolean);
      const maybeFromPathSync =
        segmentsSync.length >= 1 && !KNOWN_FIRST_SEGMENTS.has(segmentsSync[0])
          ? normalizeTenantSlug(segmentsSync[0])
          : null;

      const nextTenantSync = tenantFromQuerySync ?? maybeFromPathSync;
      if (nextTenantSync) {
        const currentSync = normalizeTenantSlug(getCookie(TENANT_COOKIE_NAME));
        if (currentSync !== nextTenantSync) {
          // Persist cookie immediately
          setCookie(TENANT_COOKIE_NAME, nextTenantSync, cookieOptions());
          // Clear stale empresa data if tenant changed
          try {
            clearEmpresaData();
            clearEmpresaId();
          } catch (e) {
            if (process.env.NODE_ENV !== "production") {
              console.warn("Erro ao limpar dados da empresa (sync):", e);
            }
          }
          // Remove any saved api_base_url to avoid cross-tenant leakage
          deleteCookie(API_BASE_URL_COOKIE_NAME, { path: "/" });
        }
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Erro ao aplicar tenant sync:", e);
      }
    }
  }

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
      // Quando o tenant muda, persistir o novo tenant e limpar configurações relacionadas
      setCookie(TENANT_COOKIE_NAME, nextTenant, cookieOptions());

      try {
        // Limpar dados da empresa previamente selecionada (localStorage)
        clearEmpresaData();
        clearEmpresaId();
      } catch (e) {
        // não propagar erros
        if (process.env.NODE_ENV !== "production") {
          console.warn("Erro ao limpar dados da empresa após mudança de tenant:", e);
        }
      }

      // Remover api_base_url salvo anteriormente (evita usar base URL de outro tenant)
      deleteCookie(API_BASE_URL_COOKIE_NAME, { path: "/" });
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

  // Fallback para preview/supervisor: se veio ?via=supervisor&empresa=ID e ainda não temos tenant,
  // buscar empresa na API e persistir tenant + empresaId/empresaData na sessão/localStorage.
  useEffect(() => {
    try {
      const via = (searchParams.get("via") ?? "").trim();
      const empresaParam = (searchParams.get("empresa") ?? "").trim();
      const currentTenant = normalizeTenantSlug(getCookie(TENANT_COOKIE_NAME));
      if (via !== "supervisor" || !empresaParam || currentTenant) return;

      if (!/^\d+$/.test(empresaParam)) return;
      const empresaIdNum = parseInt(empresaParam, 10);

      let cancelled = false;
      (async () => {
        try {
          const { data } = await api.get("/api/empresas/public/emp/lista", {
            params: { empresa_id: empresaIdNum },
          });
          if (cancelled) return;

          const empresa = Array.isArray(data) ? data[0] : data;
          if (!empresa) return;

          // Tenta extrair slug/tenant de campos possíveis
          const maybeTenant =
            normalizeTenantSlug(empresa.tenant_slug) ??
            normalizeTenantSlug(empresa.slug) ??
            normalizeTenantSlug(empresa.subdominio);

          if (maybeTenant) {
            setCookie(TENANT_COOKIE_NAME, maybeTenant, cookieOptions());
          }

          // Persistir empresa na sessão/localStorage para uso posterior
          try {
            if (empresaIdNum && Number.isFinite(empresaIdNum) && empresaIdNum > 0) {
              setEmpresaId(empresaIdNum);
            }
            setEmpresaData(empresa);
          } catch (e) {
            if (process.env.NODE_ENV !== "production") {
              console.warn("Erro ao persistir empresa na sessão (fallback):", e);
            }
          }
        } catch (e) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("Erro ao buscar empresa para persistir tenant (fallback):", e);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Erro no efeito de fallback tenant (supervisor):", e);
      }
    }
  }, [searchParams]);

  return null;
}

