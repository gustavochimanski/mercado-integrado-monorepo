"use client";

import { useState, useCallback, useEffect } from "react";
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
import { useBanners } from "@cardapio/services/useQueryBanners";

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const { isAdmin } = useUserContext();

  // Pega empresa do store
  let empresa_id = getEmpresaId();

  // Se não tiver, tenta pegar da query e seta no store
  useReceiveEmpresaFromQuery(() => {
    empresa_id = getEmpresaId(); // atualiza depois que setou via query
    setReady(true);
  });

  // Se já tiver no store, marca ready imediatamente
  useEffect(() => {
    if (empresa_id) setReady(true);
  }, [empresa_id]);

  // Hook para buscar dados da home
  const { data, isError } = useHome(empresa_id ?? null, true);

  const categorias = data?.categorias ?? [];
  const vitrines = data?.vitrines ?? [];
  const { data: data_banners } = useBanners()

  const add = useCart((s) => s.add);
  const handleAdd = useCallback(
    (produto: ProdutoEmpMini, quantity: number) => {
      add(mapProdutoToCartItem(produto, quantity));
      setSheetOpen(false);
    },
    [add]
  );

  // Render fallback enquanto não tem empresa
  if (!ready) {
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

  if (isError) return null;

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

        {data_banners && data_banners.length > 0 && (
          <div className="overflow-x-auto">
            <div className="flex flex-nowrap gap-4">
              {data_banners.map((banner) => (
                <div
                  key={banner.id}
                  className="flex-shrink-0 basis-1/4 aspect-[1/2] rounded-lg overflow-hidden shadow-md"
                >
                  <img
                    src={banner.imagem}
                    alt={banner.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}



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
