// app/menu/page.tsx
"use client"

import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { getCliente } from "@cardapio/stores/client/ClientStore";
import MenuLogado from "@cardapio/components/Shared/menu/MenuLogado";
import MenuNaoLogado from "@cardapio/components/Shared/menu/MenuNaoLogado";
import { Button } from "@cardapio/components/Shared/ui/button";
import { CircleArrowLeft } from "lucide-react";

export default function MenuPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Só executa no cliente
    const { tokenCliente } = getCliente();
    setIsLoggedIn(!!tokenCliente);
  }, []);

  // Loading enquanto verifica o estado do login
  if (isLoggedIn === null) {
    return (
      <>
        <div className="min-h-screen bg-background">
          {/* Header simplificado apenas com botão voltar */}
          <header className="w-full flex flex-row items-center sticky top-0 z-50 bg-background p-6 pb-4">
            <Button onClick={() => router.push('/')} variant="link" className="mr-auto cursor-pointer p-0">
              <CircleArrowLeft /> Voltar
            </Button>
          </header>
          <div className="p-6">Carregando...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header simplificado apenas com botão voltar */}
        <header className="w-full flex flex-row items-center sticky top-0 z-50 bg-background p-6 pb-4">
          <Button onClick={() => router.push('/')} variant="link" className="mr-auto cursor-pointer p-0">
            <CircleArrowLeft /> Voltar
          </Button>
        </header>

        <Suspense fallback={<div className="p-6">Carregando...</div>}>
          {isLoggedIn ? <MenuLogado /> : <MenuNaoLogado />}
        </Suspense>
      </div>
    </>
  );
}
