"use client";

import { useCart } from "@cardapio/stores/cart/useCart";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@cardapio/components/Shared/ui/sheet";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { CardDescription } from "../ui/card";

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, totalPrice, clear, inc, dec, remove, observacao, setObservacao, editingPedidoId } = useCart();
  const router = useRouter();

  const isEditingMode = editingPedidoId !== null;

  function handleFinalizar() {
    if (items.length === 0) return;
    onClose(); // fecha o Sheet
    router.push("/finalizar-pedido"); // redireciona para a página que faz o checkout
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-w-full p-2 gap-0 h-[80%]">
        <SheetHeader>
          <SheetTitle>
            {isEditingMode ? (
              <div className="flex flex-col gap-1">
                <span>Editando Pedido #{editingPedidoId}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Adicione ou remova produtos do pedido
                </span>
              </div>
            ) : (
              "Meu carrinho"
            )}
          </SheetTitle>
        </SheetHeader>

        <main className="p-2 overflow-y-auto space-y-2">
          {items.length === 0 && <p className="text-sm text-muted-foreground">Carrinho vazio</p>}

          {items.map((i) => (
            <div key={i.cod_barras} className="space-y-2">
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


        <div className=" border-t pt-1 mt-auto flex justify-between text-sm">
          <strong>
            <span>Total</span>
          </strong>
          <span className="font-semibold">R$ {totalPrice().toFixed(2)}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={clear} className="flex-1">
            {isEditingMode ? "Cancelar Edição" : "Limpar"}
          </Button>
          <Button className="flex-1" onClick={handleFinalizar}>
            {isEditingMode ? "Atualizar Pedido" : "Finalizar pedido"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
