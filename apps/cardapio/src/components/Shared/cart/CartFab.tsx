"use client";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@cardapio/stores/cart/useCart";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

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
    <div className="fixed bottom-20 right-6 z-50">
      <Card className="shadow-lg  p-0">
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

          <div className="text-xs font-semibold text-muted-foreground px-2 my-2 ">
            R$ {totalPrice.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
