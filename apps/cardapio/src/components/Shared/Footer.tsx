// src/components/Footer/FooterComponent.tsx

import { Home, Tag, ClipboardPen,  CircleUser, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

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
      {/* FAB central: Pesquisar */}
      <div className="relative -top-6 z-50">
        <Button
          className="w-14 h-14 bg-background text-primary rounded-full flex flex-col items-center justify-center shadow-lg border-1 border-primary transition hover:bg-muted"
        >
          <Search size={20} />
          <span className="text-[10px] font-medium leading-none">Buscar</span>
        </Button>
      </div>

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
