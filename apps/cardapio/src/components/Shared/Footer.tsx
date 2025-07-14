// src/components/Footer/FooterComponent.tsx

import { Home, Tag, ClipboardPen, Apple, CircleUser } from "lucide-react";
import Link from "next/link";

const FooterComponent = () => {
  return (
    <footer className=" sticky bottom-0 left-0 w-full bg-primary rounded-t-3xl text-background flex justify-around items-center h-14 shadow-[0_-2px_8px_rgba(0,0,0,0.08)] z-50">
      {/* Início */}
      <Link href="/" className="flex flex-col items-center gap-1 hover:text-secondary transition ">
        <Home size={18} />
        <span className="text-xs">Início</span>
      </Link>
      {/* Promoções */}
      <Link href="/promocoes" className="flex flex-col items-center gap-1 hover:text-secondary transition">
        <Tag size={18} />
        <span className="text-xs">Promoções</span>
      </Link>
      {/* Categorias */}
      <Link href="/categorias" className="flex flex-col items-center gap-1 hover:text-secondary transition">
        <Apple size={18} />
        <span className="text-xs">Categorias</span>
      </Link>
      {/* Pedidos */}
      <Link href="/pedidos" className="flex flex-col items-center gap-1 hover:text-secondary transition">
        <ClipboardPen size={18} />
        <span className="text-xs">Pedidos</span>
      </Link>
      {/* Menu */}
      <Link href="/menu" className="flex flex-col items-center gap-1 hover:text-secondary transition">
        <CircleUser size={18} />
        <span className="text-xs">Menu</span>
      </Link>
    </footer>
  );
};

export default FooterComponent;
