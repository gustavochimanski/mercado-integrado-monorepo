// src/hooks/useHydrated.ts
import { useCart } from "@cardapio/stores/cart/useCart";
import { useEffect, useState } from "react";

export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // zustand persist expõe isso:
    const unsub = useCart.persist.onFinishHydration(() => setHydrated(true));
    // se já hidratou:
    if (useCart.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}
