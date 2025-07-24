// src/components/Shared/cart/CartSheet.tsx
"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@cardapio/components/Shared/ui/sheet";
import { Button } from "@cardapio/components/Shared/ui/button";
import { useCart } from "@cardapio/stores/cart/useCart";

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, inc, dec, remove, totalPrice, clear } = useCart();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className=" max-w-full p-4">
        <SheetHeader>
          <SheetTitle>Meu carrinho</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between items-center gap-2">
              <div className="flex-1">
                <p className="font-medium text-sm">{i.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {(i.preco * i.quantity).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" onClick={() => dec(i.id)}>-</Button>
                <span>{i.quantity}</span>
                <Button size="icon" variant="outline" onClick={() => inc(i.id)}>+</Button>
              </div>

              <Button size="icon" variant="ghost" onClick={() => remove(i.id)}>x</Button>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">Carrinho vazio</p>
          )}
        </div>

        <div className="mt-6 border-t pt-4 flex justify-between text-sm">
          <span>Total</span>
          <span className="font-semibold">R$ {totalPrice().toFixed(2)}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={clear} className="flex-1">
            Limpar
          </Button>
          <Button className="flex-1" onClick={() => {/* ir pro checkout */}}>
            Finalizar pedido
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
