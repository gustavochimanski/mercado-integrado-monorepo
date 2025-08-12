"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { useState, useCallback } from "react";
import { LoginWrapper } from "@cardapio/components/auth/LoginWrapper";
import { useHome } from "@cardapio/services/useQueryHome";
import { useCart } from "@cardapio/stores/cart/useCart";
import { CartFab } from "@cardapio/components/Shared/cart/CartFab";
import { CartSheet } from "@cardapio/components/Shared/cart/CartSheet";
import { useReceiveEmpresaFromQuery } from "@cardapio/stores/empresa/useReceiveEmpresaFromQuery";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import HeaderComponent from "@cardapio/components/Shared/Header";
import CategoryScrollSection from "@cardapio/components/Shared/category/categoryScrollSection";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/product/SheetAddProduto";
import { mapProdutoToCartItem } from "@cardapio/stores/cart/mapProdutoToCartItem";
import ProductsVitrineSection from "@cardapio/components/Shared/product/ProductsVitrineSection";
import CardAddVitrine from "@cardapio/components/admin/card/CardAddVitrine";
import { CardHeader, CardTitle } from "../Shared/ui/card";

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ Seta o ID da empresa via query param
  useReceiveEmpresaFromQuery();
  const empresa_id = getEmpresaId();

  const { data, isError } = useHome(empresa_id || 0, true);
  const categorias = data?.categorias ?? [];
  const vitrines = data?.vitrines ?? [];

  // Categorias raiz: sem pai
  const categoriasRaiz = categorias.filter((cat) => cat.parent_id == null);

  const add = useCart((s) => s.add);
  const handleAdd = useCallback((produto: ProdutoEmpMini, quantity: number) => {
    add(mapProdutoToCartItem(produto, quantity));
    setSheetOpen(false);
  }, [add]);

  if (!empresa_id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-muted-foreground text-sm">
          Nenhuma empresa selecionada. Verifique a URL ou volte para o início.
        </p>
      </div>
    );
  }

  if (isError) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <LoginWrapper />
      <HeaderComponent />

      <main className="flex-1 p-2 gap-2">
        {/* Categorias raiz */}
        <CategoryScrollSection
          categorias={categoriasRaiz}
          titulo="Categorias"
          empresaId={empresa_id}
        />

        {/* Vitrines marcadas como is_home no backend */}
        {vitrines
          .filter((v) => v.is_home)
          .map((v) => (
            <ProductsVitrineSection
              key={v.id}
              vitrineId={v.id}
              titulo={v.titulo}
              produtos={v.produtos.slice(0, 3)} // Exemplo: limita a 3 produtos
              codCategoria={v.cod_categoria ?? 0}
              empresaId={empresa_id}
              onOpenSheet={(p) => {
                setProdutoSelecionado(p);
                setSheetOpen(true);
              }}
              isHome={true}
              vitrineIsHome={v.is_home}
            />
          ))}

        <div className="mt-4">
          <CardHeader>
            <CardTitle>Adicionar vitrine de Promoção</CardTitle>
          </CardHeader>
          <CardAddVitrine is_home={true} cod_categoria={null} empresa_id={empresa_id} />
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
