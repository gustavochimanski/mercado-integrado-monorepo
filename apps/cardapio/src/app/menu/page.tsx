// app/menu/page.tsx
"use client"

import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import { getCliente } from "@cardapio/stores/client/ClientStore";
import MenuLogado from "@cardapio/components/Shared/menu/MenuLogado";
import MenuNaoLogado from "@cardapio/components/Shared/menu/MenuNaoLogado";

export default function MenuPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Só executa no cliente
    const { tokenCliente } = getCliente();
    setIsLoggedIn(!!tokenCliente);
  }, []);

  // Loading enquanto verifica o estado do login
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
        <Suspense fallback={<div className="p-6">Carregando...</div>}>
          {isLoggedIn ? <MenuLogado /> : <MenuNaoLogado />}
        </Suspense>
    </div>
  );
}
