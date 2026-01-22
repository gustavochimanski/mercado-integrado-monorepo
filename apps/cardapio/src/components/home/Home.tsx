"use client";

import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoginWrapper } from "@cardapio/components/auth/LoginWrapper";
import { useHome } from "@cardapio/services/home";
import { useCart } from "@cardapio/stores/cart/useCart";
import { CartFab } from "@cardapio/components/Shared/cart/CartSuspense";
import { CartSheet } from "@cardapio/components/Shared/cart/CartSheet";
import { useReceiveEmpresaFromQuery } from "@cardapio/stores/empresa/useReceiveEmpresaFromQuery";
import { getEmpresaId, setEmpresaId, setMesaInicial, getEmpresaData } from "@cardapio/stores/empresa/empresaStore";
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
import { useQueryEmpresasDisponiveis, useBuscarEmpresa } from "@cardapio/services/empresa";
import { api } from "@cardapio/app/api/api";
import type { EmpresaPublic } from "@cardapio/services/empresa/types";

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
  const [redirecionado, setRedirecionado] = useState(false);
  const [verificandoRedirect, setVerificandoRedirect] = useState(true);
  const [podeFazerRequisicoes, setPodeFazerRequisicoes] = useState(false);
  const redirecionadoRef = useRef(false);
  const { isAdmin, refreshUser } = useUserContext();
  const { clear: clearCart, add } = useCart();
  const { loginDireto } = useMutateCliente();

  // empresa_id precisa ser reativo
  const [empresa_id, setEmpresaIdState] = useState<number | null>(() => getEmpresaId());
  
  // Só fazer requisições se não estiver redirecionando
  const { data: empresasDisponiveis = [] } = useQueryEmpresasDisponiveis({
    enabled: podeFazerRequisicoes
  });
  const { data: empresaData } = useBuscarEmpresa({ 
    empresaId: empresa_id ?? null, 
    enabled: podeFazerRequisicoes && !!empresa_id 
  });

  useReceiveEmpresaFromQuery(() => {
    const newId = getEmpresaId();
    if (newId) {
      setEmpresaIdState(newId);
      setReady(true);
    }
  });

  useEffect(() => {
    const currentId = getEmpresaId();
    if (currentId && currentId !== empresa_id) {
      setEmpresaIdState(currentId);
      setReady(true);
    } else if (currentId) {
      setReady(true);
    }
  }, [empresa_id]);

  // Função auxiliar para fazer o redirecionamento
  const fazerRedirecionamento = useCallback((url: string) => {
    if (redirecionadoRef.current) return; // Já foi redirecionado
    
    redirecionadoRef.current = true;
    setRedirecionado(true);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Redirecionando para:', url);
    }
    
    // Usar window.location.replace para redirecionamento imediato sem adicionar ao histórico
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.location.replace(url);
    } else {
      // Para rotas internas, usar window.location para forçar reload completo
      window.location.href = url;
    }
  }, []);

  // Fallback: Verificar redirecionamento caso a verificação inicial tenha falhado
  // (apenas como segurança extra, mas a verificação inicial já deve ter coberto)
  useLayoutEffect(() => {
    if (redirecionadoRef.current || !podeFazerRequisicoes) return;
    
    // Se empresaData carregou e tem redirecionamento, redirecionar (fallback)
    if (empresaData?.redireciona_home && empresaData?.redireciona_home_para) {
      const url = empresaData.redireciona_home_para.trim();
      if (url) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Redirecionamento encontrado em empresaData (fallback):', url);
        }
        fazerRedirecionamento(url);
      }
    }
  }, [empresaData, podeFazerRequisicoes, fazerRedirecionamento]);

  // VERIFICAÇÃO INICIAL: Buscar empresa ANTES de qualquer outra requisição
  // Esta é a PRIMEIRA coisa que acontece - verifica redirecionamento antes de fazer outras requisições
  useEffect(() => {
    if (redirecionadoRef.current) return;
    
    const verificarRedirecionamento = async () => {
      try {
        // Primeiro, verificar localStorage (mais rápido)
        const currentEmpresaId = empresa_id || getEmpresaId();
        if (currentEmpresaId) {
          const empresaSalva = getEmpresaData();
          if (empresaSalva?.redireciona_home && empresaSalva?.redireciona_home_para && empresaSalva?.id === currentEmpresaId) {
            const url = empresaSalva.redireciona_home_para.trim();
            if (url) {
              if (process.env.NODE_ENV !== 'production') {
                console.log('Redirecionamento encontrado no localStorage:', url);
              }
              fazerRedirecionamento(url);
              return;
            }
          }
          
          // Se não encontrou no localStorage, buscar na API
          if (process.env.NODE_ENV !== 'production') {
            console.log('Buscando empresa na API para verificar redirecionamento...');
          }
          
          const { data } = await api.get<EmpresaPublic[]>("/api/empresas/public/emp/lista", {
            params: { empresa_id: currentEmpresaId },
          });
          
          if (Array.isArray(data) && data.length > 0) {
            const empresa = data[0];
            if (empresa.redireciona_home && empresa.redireciona_home_para) {
              const url = empresa.redireciona_home_para.trim();
              if (url) {
                if (process.env.NODE_ENV !== 'production') {
                  console.log('Redirecionamento encontrado na API:', url);
                }
                fazerRedirecionamento(url);
                return;
              }
            }
          }
        } else {
          // Se não tem empresa_id, buscar lista e verificar primeira empresa
          if (process.env.NODE_ENV !== 'production') {
            console.log('Buscando lista de empresas para verificar redirecionamento...');
          }
          
          const { data } = await api.get<EmpresaPublic[]>("/api/empresas/public/emp/lista");
          
          if (Array.isArray(data) && data.length > 0) {
            // Verificar todas as empresas da lista
            for (const emp of data) {
              if (emp.redireciona_home && emp.redireciona_home_para) {
                const url = emp.redireciona_home_para.trim();
                if (url) {
                  if (process.env.NODE_ENV !== 'production') {
                    console.log('Redirecionamento encontrado na lista:', url);
                  }
                  fazerRedirecionamento(url);
                  return;
                }
              }
            }
          }
        }
        
        // Se chegou aqui, não precisa redirecionar - pode fazer outras requisições
        if (process.env.NODE_ENV !== 'production') {
          console.log('Nenhum redirecionamento necessário - habilitando outras requisições');
        }
        setPodeFazerRequisicoes(true);
        setVerificandoRedirect(false);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Erro ao verificar redirecionamento:', error);
        }
        // Em caso de erro, permitir requisições normais
        setPodeFazerRequisicoes(true);
        setVerificandoRedirect(false);
      }
    };
    
    verificarRedirecionamento();
  }, [empresa_id, fazerRedirecionamento]);

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

  // 👇 mantém o hook aqui, sem condicional - só executa se pode fazer requisições
  const { data, isError } = useHome(empresa_id ?? null, podeFazerRequisicoes);
  const { data: data_banners } = useBanners(podeFazerRequisicoes);

  useEffect(() => {
    if (redirecionadoRef.current || !podeFazerRequisicoes || empresa_id) return;
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

    // A verificação de redirecionamento já foi feita na verificação inicial
    // Se chegou aqui, não precisa redirecionar - pode definir a empresa
    setEmpresaId(nextId);
    setEmpresaIdState(nextId);
    setReady(true);
  }, [empresa_id, empresasDisponiveis, podeFazerRequisicoes]);

  const categorias = data?.categorias ?? [];
  const vitrines = data?.vitrines ?? [];
  const bannersVerticais = data_banners?.filter((b) => b.tipo_banner === "V" && b.ativo) ?? [];
  const bannerVerticalPrincipal = bannersVerticais.length > 0 ? bannersVerticais[0] : null;

  const handleAdd = useCallback(
    (produto: ProdutoEmpMini, quantity: number, observacao?: string, complementos?: import("@cardapio/stores/cart/useCart").CartItemComplemento[]) => {
      // Se houver complementos, usar diretamente; caso contrário, criar item sem complementos
      if (complementos && complementos.length > 0) {
        add({
          cod_barras: produto.cod_barras,
          nome: produto.produto.descricao,
          preco: produto.preco_venda,
          quantity,
          empresaId: produto.empresa_id ?? produto.empresa ?? 0,
          imagem: produto.produto.imagem ?? null,
          categoriaId: produto.produto.cod_categoria ?? undefined,
          subcategoriaId: produto.subcategoria_id ?? 0,
          observacao,
          complementos,
        });
      } else {
        add(mapProdutoToCartItem(produto, quantity, observacao));
      }
      setSheetOpen(false);
    },
    [add]
  );

  // 🔽 AGORA o retorno é feito DENTRO do JSX
  // Se já redirecionou ou ainda está verificando, não renderizar nada
  if (redirecionado || redirecionadoRef.current || verificandoRedirect) {
    return null; // Não renderizar nada enquanto verifica ou após redirecionar
  }

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
