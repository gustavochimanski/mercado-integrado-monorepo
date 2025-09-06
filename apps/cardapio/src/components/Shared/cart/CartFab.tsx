"use client";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@cardapio/stores/cart/useCart";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

interface Props {
  onOpen: () => void;
}

export function CartFab({ onOpen }: Props) {
  const total = useCart((s) =>
    s.items.reduce((acc, i) => acc + i.quantity, 0)
  );
  const totalPrice = useCart((s) =>
    s.items.reduce((acc, i) => acc + i.quantity * i.preco, 0)
  );

  const pathname = usePathname();

  // Oculta se não houver itens ou se estiver na rota /finalizar-pedido
  if (total === 0 || pathname === "/finalizar-pedido") return null;
  if (total === 0 || pathname === "/menu") return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4">
      <Button
        onClick={onOpen}
        className="relative w-full max-w-md flex items-center justify-between gap-3 rounded-full px-5 py-5 shadow-xl bg-primary text-background"
      >
        {/* Ícone */}
        <div className="relative">
          <ShoppingCart className="w-6 h-6" />
        </div>

        {/* Texto */}
        <span className="flex-1 text-center font-semibold text-base">
          Ver carrinho
        </span>

        {/* Valor */}
        <span className="text-sm font-bold">
          R$ {totalPrice.toFixed(2)}
        </span>
      </Button>
    </div>
  );
}
