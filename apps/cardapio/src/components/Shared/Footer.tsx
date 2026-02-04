"use client";

import { Home, ClipboardPen, CircleUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

const TENANT_COOKIE_NAME = "tenant_slug";

function normalizeTenantSlug(value: unknown): string | null {
  const slug = (typeof value === "string" ? value : "").trim().toLowerCase();
  if (!slug) return null;
  return /^[a-z0-9-]+$/.test(slug) ? slug : null;
}

const FooterComponent = () => {
  const pathname = usePathname();
  // IMPORTANTE: não ler cookie durante o render.
  // No SSR este Client Component renderiza sem acesso ao cookie, e no client o cookie existe.
  // Se calcular o href direto no render, gera hydration mismatch (SSR "/" vs client "/<tenant>").
  const [homeHref, setHomeHref] = useState<string>("/");

  useEffect(() => {
    const tenantFromCookie = normalizeTenantSlug(getCookie(TENANT_COOKIE_NAME));
    setHomeHref(tenantFromCookie ? `/${tenantFromCookie}` : "/");
    // Recalcular em mudanças de rota ajuda quando o cookie é setado após navegação.
  }, [pathname]);
  
  // Não renderizar o footer na rota /finalizar-pedido
  if (pathname === "/finalizar-pedido") {
    return null;
  }

  // Em /landingpage-store o "Início" deve ficar ativo como no home
  const isLandingpageStore =
    pathname === "/landingpage-store" ||
    pathname.startsWith("/landingpage-store/") ||
    pathname === "/landing-page/store" ||
    pathname.startsWith("/landing-page/store/");

  const isHomeActive = pathname === homeHref || isLandingpageStore;
  
  return (
    <footer className="sticky bottom-0 left-0 w-full bg-white/80 backdrop-blur-sm rounded-t-3xl flex justify-around items-center h-16 shadow-sm z-50 border-t border-border">
      {/* Início */}
      <Link
        href={homeHref}
        className={`flex flex-col items-center gap-1 transition ${
          isHomeActive
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <Home size={20} />
        <span className="text-[11px]">Início</span>
      </Link>

      {/* Pedidos */}
      <Link
        href="/pedidos"
        className={`flex flex-col items-center gap-1 transition ${
          pathname === "/pedidos"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <ClipboardPen size={20} />
        <span className="text-[11px]">Pedidos</span>
      </Link>

      {/* Menu */}
      <Link
        href="/menu"
        className={`flex flex-col items-center gap-1 transition ${
          pathname === "/menu"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <CircleUser size={20} />
        <span className="text-[11px]">Menu</span>
      </Link>
    </footer>
  );
};

export default FooterComponent;
