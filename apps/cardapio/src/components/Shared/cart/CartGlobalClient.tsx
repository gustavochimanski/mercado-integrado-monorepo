"use client";
import { CartFab } from "./CartSuspense";
import { CartSheet } from "./CartSheet";
import { useCartSheet } from "@cardapio/stores/cart/useCartSheet";

export function CartGlobalClient() {
  const open = useCartSheet((s) => s.open);
  const openSheet = useCartSheet((s) => s.openSheet);
  const closeSheet = useCartSheet((s) => s.closeSheet);

  return (
    <>
      <CartFab onOpen={openSheet} />
      <CartSheet open={open} onClose={closeSheet} />
    </>
  );
}
