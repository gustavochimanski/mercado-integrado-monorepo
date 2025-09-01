// HomePage.tsx (ajustado)
"use client";

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
import VitrineDestaques from "@cardapio/components/Shared/vitrine/VitrineDestaques";
import CardAddVitrine from "@cardapio/components/admin/card/CardAddVitrine";
import { CardHeader, CardTitle } from "../Shared/ui/card";
import { useUserContext } from "@cardapio/hooks/auth/userContext";

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const { isAdmin } = useUserContext();

  // seta empresa_id via query param
  useReceiveEmpresaFromQuery(() => setReady(true));

  const empresa_id = getEmpresaId();

  // ✅ só dispara a query depois que ready=true e empresa_id existe
  const { data, isError, isLoading } = useHome(empresa_id, true);

  const categorias = data?.categorias ?? [];
  const vitrines = data?.vitrines ?? [];

  const add = useCart((s) => s.add);
  const handleAdd = useCallback(
    (produto: ProdutoEmpMini, quantity: number) => {
      add(mapProdutoToCartItem(produto, quantity));
      setSheetOpen(false);
    },
    [add]
  );

  // fallback enquanto ainda não temos empresa
  if (!ready || !empresa_id || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Carregando empresa...
      </div>
    );
  }

  if (!empresa_id) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-muted-foreground text-sm">
          Nenhuma empresa selecionada. Verifique a URL ou volte para o início.
        </p>
      </div>
    );
  }

  if (isError) return <p>Erro ao carregar dados da empresa.</p>;

  return (
    <div className="flex flex-col gap-4">
      <LoginWrapper />
      <HeaderComponent />

      <main className="flex-1 p-2 gap-2">
        {/* Categorias raiz */}
        <CategoryScrollSection
          categorias={categorias}
          titulo="Categorias"
          empresaId={empresa_id}
        />

        {/* Vitrines marcadas como is_home */}
        {vitrines
          .filter((v) => v.is_home)
          .map((v) => (
            <VitrineDestaques
              key={v.id}
              titulo={v.titulo}
              produtos={v.produtos}
              verMaisHref={v.href_categoria}
              empresaId={empresa_id}
              codCategoria={v.cod_categoria}
              vitrineId={v.id}
              is_home={v.is_home}
              onSelectProduto={(p) => {
                setProdutoSelecionado(p);
                setSheetOpen(true);
              }}
            />
          ))}

        {isAdmin && (
          <div className="mt-4">
            <CardHeader>
              <CardTitle>Adicionar vitrine de Promoção</CardTitle>
            </CardHeader>
            <CardAddVitrine is_home={true} cod_categoria={null} />
          </div>
        )}
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
