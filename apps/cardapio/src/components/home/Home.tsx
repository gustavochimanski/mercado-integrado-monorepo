"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoginWrapper } from "@cardapio/components/auth/LoginWrapper";
import { useHome } from "@cardapio/services/useQueryHome";
import { useCart } from "@cardapio/stores/cart/useCart";
import { CartFab } from "@cardapio/components/Shared/cart/CartSuspense";
import { CartSheet } from "@cardapio/components/Shared/cart/CartSheet";
import { useReceiveEmpresaFromQuery } from "@cardapio/stores/empresa/useReceiveEmpresaFromQuery";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import { clearCliente, setCliente } from "@cardapio/stores/client/ClientStore";
import { useMutateCliente, ClienteOut } from "@cardapio/services/useQueryCliente";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
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
import { BannerVertical, BannersHorizontal } from "../Shared/parceiros/Banners";


export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const { isAdmin, refreshUser } = useUserContext();
  const { clear: clearCart } = useCart();
  const { loginDireto } = useMutateCliente();

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

  // Verifica se via=pedido_admin está na URL e limpa os stores
  useEffect(() => {
    const viaParam = searchParams.get("via");
    const idClienteParam = searchParams.get("id_cliente");
    // Aceita tanto "pedido_admin" (underscore) quanto "pedido+admin" (plus que vira espaço)
    const viaPedidoAdmin = viaParam === "pedido_admin" || viaParam === "pedido admin";
    
    if (viaPedidoAdmin) {
      clearCliente();
      clearCart();
      
      // Se vier id_cliente, busca o cliente e faz login automático
      if (idClienteParam) {
        const clienteId = parseInt(idClienteParam, 10);
        if (!isNaN(clienteId) && clienteId > 0) {
          // Busca o cliente por ID usando API admin
          apiClienteAdmin
            .get<ClienteOut>(`/api/delivery/admin/clientes/${clienteId}`)
            .then((response) => {
              const cliente = response.data;
              
              // Se o cliente tem telefone, faz login direto
              if (cliente.telefone) {
                const telefoneLimpo = cliente.telefone.replace(/\D/g, "");
                
                loginDireto.mutate(
                  { telefone: telefoneLimpo },
                  {
                    onSuccess: async (loginResponse) => {
                      // Salva informações completas do cliente no storage
                      setCliente({
                        id: cliente.id,
                        nome: loginResponse.data.nome || cliente.nome,
                        telefone: loginResponse.data.telefone || cliente.telefone || undefined,
                        email: cliente.email || undefined,
                        tokenCliente: loginResponse.data.super_token,
                      });
                      
                      // Atualiza o contexto do usuário para verificar se é admin
                      try {
                        await refreshUser();
                        // Pequeno delay para garantir que o estado foi atualizado
                        await new Promise(resolve => setTimeout(resolve, 100));
                      } catch (error) {
                        console.warn("Erro ao atualizar contexto do usuário:", error);
                      }
                      
                      // Remove os parâmetros da URL
                      const newSearchParams = new URLSearchParams(searchParams.toString());
                      newSearchParams.delete("via");
                      newSearchParams.delete("id_cliente");
                      const newUrl = newSearchParams.toString() 
                        ? `/?${newSearchParams.toString()}`
                        : "/";
                      router.replace(newUrl);
                    },
                    onError: (error) => {
                      console.error("Erro ao fazer login automático:", error);
                      // Remove apenas o id_cliente, mantém via para tentar novamente
                      const newSearchParams = new URLSearchParams(searchParams.toString());
                      newSearchParams.delete("id_cliente");
                      const newUrl = newSearchParams.toString() 
                        ? `/?${newSearchParams.toString()}`
                        : "/";
                      router.replace(newUrl);
                    },
                  }
                );
              } else {
                // Cliente sem telefone, apenas remove o id_cliente
                const newSearchParams = new URLSearchParams(searchParams.toString());
                newSearchParams.delete("id_cliente");
                const newUrl = newSearchParams.toString() 
                  ? `/?${newSearchParams.toString()}`
                  : "/";
                router.replace(newUrl);
              }
            })
            .catch((error) => {
              console.error("Erro ao buscar cliente:", error);
              // Remove apenas o id_cliente em caso de erro
              const newSearchParams = new URLSearchParams(searchParams.toString());
              newSearchParams.delete("id_cliente");
              const newUrl = newSearchParams.toString() 
                ? `/?${newSearchParams.toString()}`
                : "/";
              router.replace(newUrl);
            });
        } else {
          // ID inválido, apenas remove o id_cliente
          const newSearchParams = new URLSearchParams(searchParams.toString());
          newSearchParams.delete("id_cliente");
          const newUrl = newSearchParams.toString() 
            ? `/?${newSearchParams.toString()}`
            : "/";
          router.replace(newUrl);
        }
      } else {
        // Sem id_cliente, apenas remove o parâmetro via
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete("via");
        const newUrl = newSearchParams.toString() 
          ? `/?${newSearchParams.toString()}`
          : "/";
        router.replace(newUrl);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router, loginDireto]);

  // Hook para buscar dados da home
  const { data, isError } = useHome(empresa_id ?? null, true);

  const categorias = data?.categorias ?? [];
  const vitrines = data?.vitrines ?? [];
  const { data: data_banners } = useBanners();

  // Separar banners por tipo
  const bannersVerticais = data_banners?.filter((b) => b.tipo_banner === "V" && b.ativo) ?? [];
  const bannerVerticalPrincipal = bannersVerticais.length > 0 ? bannersVerticais[0] : null;

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
    <div className="flex flex-col">
      <LoginWrapper />
      <HeaderComponent />

      <main className="flex-1 pt-4 pb-20">
        {/* Categorias raiz */}
        <CategoryScrollSection
          categorias={categorias}
          empresaId={empresa_id}
        />

        {/* Banner Vertical (tipo V) - Exibe apenas 1 no topo */}
        <BannerVertical banner={bannerVerticalPrincipal} isAdmin={isAdmin} />

        {/* Vitrines marcadas como is_home */}
        <div className="space-y-6">
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
        </div>

        {/* Banners Horizontais (tipo H) - Exibe após todas as vitrines */}
        <BannersHorizontal banners={data_banners ?? []} isAdmin={isAdmin} />

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
