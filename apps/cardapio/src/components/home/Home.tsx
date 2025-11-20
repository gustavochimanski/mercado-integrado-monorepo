"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoginWrapper } from "@cardapio/components/auth/LoginWrapper";
import { useHome } from "@cardapio/services/home";
import { useCart } from "@cardapio/stores/cart/useCart";
import { CartFab } from "@cardapio/components/Shared/cart/CartSuspense";
import { CartSheet } from "@cardapio/components/Shared/cart/CartSheet";
import { useReceiveEmpresaFromQuery } from "@cardapio/stores/empresa/useReceiveEmpresaFromQuery";
import { getEmpresaId, setEmpresaId, setMesaInicial } from "@cardapio/stores/empresa/empresaStore";
import { useMutateCliente} from "@cardapio/services/cliente";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import HeaderComponent from "@cardapio/components/Shared/Header";
import CategoryScrollSection from "@cardapio/components/Shared/category/categoryScrollSection";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/product/SheetAddProduto";
import { mapProdutoToCartItem } from "@cardapio/stores/cart/mapProdutoToCartItem";
import VitrineDestaques from "@cardapio/components/Shared/vitrine/VitrineDestaques";
import CardAddVitrine from "@cardapio/components/admin/card/CardAddVitrine";
import { CardHeader, CardTitle } from "../Shared/ui/card";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { useBanners } from "@cardapio/services/banners";
import { BannerVertical, BannersHorizontal } from "../Shared/parceiros/Banners";
import { useQueryEmpresasDisponiveis } from "@cardapio/services/empresa";

export default function HomePage() {
  // ✅ TODOS os hooks primeiro, sem returns no meio
  const router = useRouter();
  const searchParams = useSearchParams();
  const mesaIdParam = searchParams.get("mesa_id");
  const mesaPessoasParam =
    searchParams.get("mesa_pessoas") ?? searchParams.get("mesa_num_pessoas");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const { isAdmin, refreshUser } = useUserContext();
  const { clear: clearCart, add } = useCart();
  const { loginDireto } = useMutateCliente();

  // empresa_id precisa ser estável
  let empresa_id = getEmpresaId();
  const { data: empresasDisponiveis = [] } = useQueryEmpresasDisponiveis();

  useReceiveEmpresaFromQuery(() => {
    empresa_id = getEmpresaId();
    setReady(true);
  });

  useEffect(() => {
    if (empresa_id) setReady(true);
  }, [empresa_id]);

  useEffect(() => {
    if (!mesaIdParam) return;
    const codigo = mesaIdParam.trim();
    if (!codigo) return;

    const parsedPessoas = mesaPessoasParam ? Number(mesaPessoasParam) : null;
    const numPessoas =
      parsedPessoas && Number.isFinite(parsedPessoas) && parsedPessoas > 0
        ? Math.trunc(parsedPessoas)
        : null;

    setMesaInicial(codigo, numPessoas);
  }, [mesaIdParam, mesaPessoasParam]);

  // 👇 mantém o hook aqui, sem condicional
  const { data, isError } = useHome(empresa_id ?? null, true);
  const { data: data_banners } = useBanners();

  useEffect(() => {
    if (empresa_id) return;
    if (!empresasDisponiveis.length) return;

    const [melhorEmpresa] = [...empresasDisponiveis].sort((a, b) => {
      const distanciaA = a.distancia_km ?? Number.POSITIVE_INFINITY;
      const distanciaB = b.distancia_km ?? Number.POSITIVE_INFINITY;

      if (distanciaA !== distanciaB) {
        return distanciaA - distanciaB;
      }

      return (a.id ?? Number.POSITIVE_INFINITY) - (b.id ?? Number.POSITIVE_INFINITY);
    });

    const nextId = Number(melhorEmpresa?.id);
    if (!Number.isFinite(nextId) || nextId <= 0) {
      return;
    }

    setEmpresaId(nextId);
    setReady(true);
  }, [empresa_id, empresasDisponiveis]);

  const categorias = data?.categorias ?? [];
  const vitrines = data?.vitrines ?? [];
  const bannersVerticais = data_banners?.filter((b) => b.tipo_banner === "V" && b.ativo) ?? [];
  const bannerVerticalPrincipal = bannersVerticais.length > 0 ? bannersVerticais[0] : null;

  const handleAdd = useCallback(
    (produto: ProdutoEmpMini, quantity: number, observacao?: string, adicionais_ids?: number[]) => {
      add(mapProdutoToCartItem(produto, quantity, observacao, adicionais_ids));
      setSheetOpen(false);
    },
    [add]
  );

  // 🔽 AGORA o retorno é feito DENTRO do JSX
  if (!ready)
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Carregando empresa...
      </div>
    );

  if (!empresa_id)
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-muted-foreground text-sm">
          Nenhuma empresa selecionada. Verifique a URL ou volte para o início.
        </p>
      </div>
    );

  if (isError) return null;

  // ✅ Fluxo normal da home
  return (
    <div className="flex flex-col">
      <LoginWrapper />
      <HeaderComponent />

      <main className="flex-1 pt-4 pb-20">
        <CategoryScrollSection categorias={categorias} empresaId={empresa_id} />
        <BannerVertical banner={bannerVerticalPrincipal} isAdmin={isAdmin} />

        <div className="space-y-6">
          {vitrines
            .filter((v) => v.is_home)
            .map((v) => (
              <VitrineDestaques
                key={v.id}
                titulo={v.titulo}
                produtos={v.produtos}
                combos={v.combos}
                receitas={v.receitas}
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
        </div>

        <BannersHorizontal banners={data_banners ?? []} isAdmin={isAdmin} />

        {isAdmin && (
          <div className="mt-4">
            <CardHeader>
              <CardTitle>Adicionar vitrine de Promoção</CardTitle>
            </CardHeader>
            <CardAddVitrine is_home cod_categoria={null} />
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
