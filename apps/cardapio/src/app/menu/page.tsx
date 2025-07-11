// app/menu/page.tsx
"use client"
import { Suspense } from "react";
import { TokenHandler } from "@cardapio/components/auth/TokenHandler";

export default function MenuPage() {
  return (
    <>
      <Suspense fallback={null}>
        <TokenHandler />
      </Suspense>

      {/* Conteúdo normal da página */}
    </>
  );
}
