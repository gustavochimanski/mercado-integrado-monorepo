"use client";

import { Home, Tag, ClipboardPen, CircleUser, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

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

      {/* Botão central */}
      <div className="relative -top-7 z-50">
        <Button
          className="w-14 h-14 bg-primary text-white rounded-full shadow-md flex flex-col items-center justify-center transition hover:brightness-110"
        >
          <Search size={20} />
          <span className="text-[10px] font-medium leading-none">Buscar</span>
        </Button>
      </div>

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
