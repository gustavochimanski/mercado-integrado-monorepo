"use client";

import { useCart } from "@cardapio/stores/cart/useCart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@cardapio/components/Shared/ui/sheet";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, totalPrice, clear, inc, dec, remove, observacao, setObservacao } = useCart();
  const router = useRouter();

  function handleFinalizar() {
    if (items.length === 0) return;
    onClose(); // fecha o Sheet
    router.push("/finalizar-pedido"); // redireciona para a página que faz o checkout
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-w-full p-2 h-[70%]">
        <SheetHeader>
          <SheetTitle>Meu carrinho</SheetTitle>
        </SheetHeader>

        <main className="p-2 overflow-y-auto space-y-4">
          {items.length === 0 && <p className="text-sm text-muted-foreground">Carrinho vazio</p>}

          {items.map((i) => (
            <div key={i.cod_barras}>
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1">
                  <p className="font-medium text-sm">{i.nome}</p>
                  {i.observacao && (
                    <p className="text-xs italic text-muted-foreground break-words max-w-[200px]">
                      {i.observacao}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    R$ {(i.preco * i.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" onClick={() => dec(i.cod_barras)}>
                    -
                  </Button>
                  <span>{i.quantity}</span>
                  <Button size="icon" variant="outline" onClick={() => inc(i.cod_barras)}>
                    +
                  </Button>
                </div>

                <Button size="icon" variant="ghost" onClick={() => remove(i.cod_barras)}>
                  x
                </Button>
              </div>
              <Separator />
            </div>
          ))}
        </main>

        <div className="px-2 py-4">
          <Label htmlFor="obs_geral">Observação do pedido</Label>
          <Textarea
            id="obs_geral"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Ex: Sem cebola, sem maionese..."
            className="w-full"
            maxLength={200}
          />
        </div>

        <div className="mt-4 border-t pt-4 flex justify-between text-sm">
          <span>Total</span>
          <span className="font-semibold">R$ {totalPrice().toFixed(2)}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={clear} className="flex-1">
            Limpar
          </Button>
          <Button className="flex-1" onClick={handleFinalizar}>
            Finalizar pedido
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
