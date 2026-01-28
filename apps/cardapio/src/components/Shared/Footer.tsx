"use client";

import { Home, ClipboardPen, CircleUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next";

const TENANT_COOKIE_NAME = "tenant_slug";

function normalizeTenantSlug(value: unknown): string | null {
  const slug = (typeof value === "string" ? value : "").trim().toLowerCase();
  if (!slug) return null;
  return /^[a-z0-9-]+$/.test(slug) ? slug : null;
}

const FooterComponent = () => {
  const pathname = usePathname();
  const tenantFromCookie = normalizeTenantSlug(getCookie(TENANT_COOKIE_NAME));
  const homeHref = tenantFromCookie ? `/${tenantFromCookie}` : "/";
  
  // Não renderizar o footer na rota /finalizar-pedido
  if (pathname === "/finalizar-pedido") {
    return null;
  }
  
  return (
    <footer className="sticky bottom-0 left-0 w-full bg-white/80 backdrop-blur-sm rounded-t-3xl flex justify-around items-center h-16 shadow-sm z-50 border-t border-border">
      {/* Início */}
      <Link
        href={homeHref}
        className={`flex flex-col items-center gap-1 transition ${
          pathname === homeHref
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
