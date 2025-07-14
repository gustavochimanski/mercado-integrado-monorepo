// app/page.tsx
"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; 

import { useState } from "react";
import { ProdutoEmpMini } from "../types/Produtos";
import CategoryScrollSection from "../components/Shared/Category/categoryScrollSection";
import HeaderComponent from "../components/Shared/Header";
import { SheetAdicionarProduto } from "../components/Shared/Sheet/SheetAddProduto";
import { useCategoriasDelivery } from "../hooks/useCategoriasDelivery";
import { LoginWrapper } from "@cardapio/components/auth/LoginWrapper";

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);

  const empresaId = 1;
  const { data: categorias = [] } = useCategoriasDelivery(empresaId);
  const categoriasRaiz = categorias.filter((cat) => cat.slug_pai === null);

  function handleAdd(produto: ProdutoEmpMini, quantity: number) {
    alert(`Adicionado: ${produto.produto.descricao} x${quantity}`);
    setProdutoSelecionado(produto);
    setSheetOpen(false);
  }

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <LoginWrapper />

      <HeaderComponent />
      <main className="flex-1 p-2">
        <CategoryScrollSection categorias={categoriasRaiz} titulo="Categorias" empresaId={1} />
      </main>

      {produtoSelecionado && (
        <SheetAdicionarProduto
          produto={produtoSelecionado}
          isOpen={sheetOpen}
          onAdd={handleAdd}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
