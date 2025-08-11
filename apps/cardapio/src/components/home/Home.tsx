"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useState, useCallback } from "react";
import { LoginWrapper } from "@cardapio/components/auth/LoginWrapper";
import { useCardapio } from "@cardapio/services/useQueryCardapio";
import { useCart } from "@cardapio/stores/cart/useCart";
import { CartFab } from "@cardapio/components/Shared/cart/CartFab";
import { CartSheet } from "@cardapio/components/Shared/cart/CartSheet";
import { useReceiveEmpresaFromQuery } from "@cardapio/stores/empresa/useReceiveEmpresaFromQuery";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import CardAddSecaoSubCateg from "@cardapio/components/admin/card/CardAddVitrine";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import HeaderComponent from "@cardapio/components/Shared/Header";
import CategoryScrollSection from "@cardapio/components/Shared/category/categoryScrollSection";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/product/SheetAddProduto";
import { mapProdutoToCartItem } from "@cardapio/stores/cart/mapProdutoToCartItem";
import VitrineDestaques from "../Shared/VitrineDestaques";
import CardAddVitrine from "@cardapio/components/admin/card/CardAddVitrine";
import { CardHeader, CardTitle } from "../Shared/ui/card";

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ Seta o ID da empresa via query param
  useReceiveEmpresaFromQuery();

  const empresaId = getEmpresaId();
  const { data: categorias = [], isError} = useCardapio(empresaId || 0);

  const categoriasRaiz = categorias.filter((cat) => cat.slug_pai === null);

  const add = useCart((s) => s.add);
  const handleAdd = useCallback((produto: ProdutoEmpMini, quantity: number) => {
    add(mapProdutoToCartItem(produto, quantity));
    setSheetOpen(false);
  }, [add]);

  if (!empresaId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-muted-foreground text-sm">
          Nenhuma empresa selecionada. Verifique a URL ou volte para o início.
        </p>
      </div>
    );
  }

  if (!empresaId || isError) {
    return null;
  }


  return (
    <div className="min-h-screen flex flex-col gap-4">
      <LoginWrapper />
      <HeaderComponent />

      <main className="flex-1 p-2 gap-2">
        <CategoryScrollSection
          categorias={categoriasRaiz}
          titulo="Categorias"
          empresaId={empresaId}
        />

          <VitrineDestaques
            verMaisHref={`/vitrine?empresaId=${empresaId}`}
            onSelectProduto={(p) => {
              setProdutoSelecionado(p);
              setSheetOpen(true);
            }}
            // opcional: você pode passar "produtos" aqui; se não, usa o mock interno
            // produtos={minhaListaDeProdutos}
          />
          
          <div className="mt-4">
            <CardHeader>
              <CardTitle>Adcionar vitrine de </CardTitle>
            </CardHeader>
            <CardAddVitrine empresaId={empresaId} codCategoria={"D"} />
          </div>
      </main>

      {produtoSelecionado && (
        <SheetAdicionarProduto
          produto={produtoSelecionado}
          isOpen={sheetOpen}
          onAdd={handleAdd}
          onClose={() => setSheetOpen(false)}
        />
      )}

      <CartFab onOpen={() => setCartOpen(true)} />
      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
