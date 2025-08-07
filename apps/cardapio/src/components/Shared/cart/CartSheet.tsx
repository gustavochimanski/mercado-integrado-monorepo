"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@cardapio/components/Shared/ui/sheet";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useCart } from "@cardapio/stores/cart/useCart";
import { useState } from "react";
import { useFinalizarPedido } from "@cardapio/services/useFinalizarPedido";
import { useUser } from "@cardapio/hooks/useUser";

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { 
    items, 
    observacao, 
    setObservacao, 
    inc, 
    dec, 
    remove, 
    totalPrice, 
    clear 
  } = useCart();

  const { user } = useUser();
  const { loading, finalizarPedido } = useFinalizarPedido();

  if (!user) {
    <div></div>
  }

  async function handleFinalizar() {
    try {
      await finalizarPedido({
        cliente_id: 'user.id',
        meio_pagamento_id: undefined,
        endereco_entrega_id: undefined,
      });
      onClose();
    } catch {
      // toast já exibido dentro do hook
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="max-w-full p-2 h-[70%]">
        <SheetHeader>
          <SheetTitle>Meu carrinho</SheetTitle>
        </SheetHeader>

        <main className="p-2 overflow-y-auto">
          <div className="mt-4 space-y-4">
            {items.map((i) => (
              <div key={i.id}>
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
                    <Button size="icon" variant="outline" onClick={() => dec(i.id)}>
                      -
                    </Button>
                    <span>{i.quantity}</span>
                    <Button size="icon" variant="outline" onClick={() => inc(i.id)}>
                      +
                    </Button>
                  </div>

                  <Button size="icon" variant="ghost" onClick={() => remove(i.id)}>
                    x
                  </Button>
                </div>
                <Separator />
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
        </main>

        {/* Observação global do pedido */}
        <div className="px-2 py-4">
          <Label htmlFor="obs_geral">Observação do pedido</Label>
          <Textarea
            id="obs_geral"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Ex: Separar sem lacre, sem cebola etc."
            className="w-full"
            maxLength={200}
          />
        </div>

        <div className="mt-auto flex gap-2">
          <Button variant="outline" onClick={clear} className="flex-1">
            Limpar
          </Button>
          <Button
            className="flex-1"
            onClick={handleFinalizar}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Finalizar pedido"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
