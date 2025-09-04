"use client";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@cardapio/stores/cart/useCart";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardTitle } from "../ui/card";

interface Props {
  onOpen: () => void;
}

export function CartFab({ onOpen }: Props) {
  const total = useCart((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const totalPrice = useCart((s) =>
    s.items.reduce((acc, i) => acc + i.quantity * i.preco, 0)
  );

  if (total === 0) return null;

  return (
    <div className="fixed top-20 right-8 z-32">
      <Card className="shadow-lg w-[100px] h-26 text-xs font-sans text-muted-foreground  p-0 gap-2 rounded-t-none">
        <CardTitle className="text-center mt-4">Carrinho</CardTitle>
        <CardContent className="flex flex-col items-center p-0">
          <Button onClick={onOpen} variant="default" className="relative w-full rounded-xl">
            <ShoppingCart  />
            <Badge
              variant="secondary"
              className="absolute -top-2.5 -right-2.5 text-xs px-1.5 py-0.5 "
            >
              {total}
            </Badge>
          </Button>

          <div className="text-xs font-semibold  text-muted-foreground  px-2 my-2 ">
            R$ {totalPrice.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
