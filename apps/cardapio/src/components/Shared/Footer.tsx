"use client";

import { Home, Tag, ClipboardPen, CircleUser, Search } from "lucide-react";
import Link from "next/link";

const FooterComponent = () => {
  return (
    <footer className="sticky bottom-0 left-0 w-full bg-white/80 backdrop-blur-sm rounded-t-3xl text-muted-foreground flex justify-around items-center h-16 shadow-sm z-50 border-t border-border">
      {/* Início */}
      <Link
        href="/"
        className="flex flex-col items-center gap-1 hover:text-primary transition"
      >
        <Home size={20} />
        <span className="text-[11px]">Início</span>
      </Link>

      {/* Promoções */}
      <Link
        href="/promocoes"
        className="flex flex-col items-center gap-1 hover:text-primary transition"
      >
        <Tag size={20} />
        <span className="text-[11px]">Promoções</span>
      </Link>
      {/* Promoções */}
      <Link
        href="/promocoes"
        className="flex flex-col items-center gap-1 hover:text-primary transition"
      >
        <Search size={20} />
        <span className="text-[11px]">Buscar</span>
      </Link>

      {/* Pedidos */}
      <Link
        href="/pedidos"
        className="flex flex-col items-center gap-1 hover:text-primary transition"
      >
        <ClipboardPen size={20} />
        <span className="text-[11px]">Pedidos</span>
      </Link>

      {/* Menu */}
      <Link
        href="/menu"
        className="flex flex-col items-center gap-1 hover:text-primary transition"
      >
        <CircleUser size={20} />
        <span className="text-[11px]">Menu</span>
      </Link>
    </footer>
  );
};

export default FooterComponent;
