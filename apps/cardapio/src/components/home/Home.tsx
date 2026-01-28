"use client";

import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useHome } from "@cardapio/services/home";
import { useCart } from "@cardapio/stores/cart/useCart";
import { CartFab } from "@cardapio/components/Shared/cart/CartSuspense";
import { CartSheet } from "@cardapio/components/Shared/cart/CartSheet";
import { useReceiveEmpresaFromQuery } from "@cardapio/stores/empresa/useReceiveEmpresaFromQuery";
import { getEmpresaId, setEmpresaId, setMesaInicial, getEmpresaData, setEmpresaData } from "@cardapio/stores/empresa/empresaStore";
import { useMutateCliente} from "@cardapio/services/cliente";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
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
import { useQueryClient } from "@tanstack/react-query";
import { filterCategoriasBySearch, filterVitrinesBySearch } from "@cardapio/lib/filter-by-search";
import { useMemo } from "react";
import { verificarLojaAberta } from "@cardapio/lib/empresa/verificarLojaAberta";
import { useAutoLoginFromClientNumber } from "@cardapio/lib/params/useAutoLoginFromClientNumber";

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
  const [agora, setAgora] = useState<Date | null>(null);
  const { loginDireto } = useMutateCliente();
  const queryClient = useQueryClient();

  // ✅ Auto-login via `?client_number=...`
  useAutoLoginFromClientNumber(loginDireto);

  // empresa_id precisa ser reativo
  const [empresa_id_state, setEmpresaIdState] = useState<number | null>(() => getEmpresaId());

  // ✅ Fonte de verdade: URL tem prioridade. Ao mudar ?empresa=1 → ?empresa=2, o id já reflete sem esperar state.
  const empresaParam = searchParams.get("empresa");
  const empresaIdFromUrl = useMemo(() => {
    const raw = (empresaParam ?? "").trim();
    if (!raw || !/^\d+$/.test(raw)) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [empresaParam]);

  const empresa_id = empresaIdFromUrl ?? empresa_id_state;

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
      // Invalidar cache do React Query quando a empresa muda
      queryClient.invalidateQueries({ queryKey: ["empresa-public"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      
      setEmpresaIdState(newId);
      setReady(true);
    }
  });

  // ✅ CORREÇÃO: Garantir que ready seja setado quando empresa_id já existe na inicialização
  useEffect(() => {
    const currentId = getEmpresaId();
    if (currentId && currentId !== empresa_id_state) {
      setEmpresaIdState(currentId);
      setReady(true);
    } else if (currentId && currentId > 0) {
      // Se já temos uma empresa válida, setar ready imediatamente
      setReady(true);
    }
  }, [empresa_id_state]);

  // ✅ NOVO: Verificar na montagem inicial se já temos empresa do localStorage
  useEffect(() => {
    const initialId = getEmpresaId();
    if (initialId && initialId > 0 && !ready) {
      // Se temos empresa no localStorage mas ready ainda não foi setado, setar agora
      setEmpresaIdState(initialId);
      setReady(true);
    }
  }, []); // Executa apenas na montagem inicial

  // Função auxiliar para fazer o redirecionamento
  const fazerRedirecionamento = useCallback((url: string, empresa?: EmpresaPublic | null, empresaId?: number | null) => {
    if (redirecionadoRef.current) return; // Já foi redirecionado
    
    // IMPORTANTE: Salvar empresa no localStorage ANTES de redirecionar
    const idParaSalvar = empresaId || empresa?.id;
    if (idParaSalvar) {
      setEmpresaId(idParaSalvar);
      if (empresa) {
        setEmpresaData(empresa);
      }
    }
    
    redirecionadoRef.current = true;
    setRedirecionado(true);
    
    // ✅ PRESERVAR via=supervisor se existir na URL atual
    const viaSupervisor = searchParams.get("via");
    const isExternalUrl = url.startsWith('http://') || url.startsWith('https://');
    const urlObj = isExternalUrl 
      ? new URL(url)
      : new URL(url, window.location.origin);
    
    // Se já tiver via na URL de redirecionamento, não sobrescrever
    if (viaSupervisor === "supervisor" && !urlObj.searchParams.has("via")) {
      urlObj.searchParams.set("via", "supervisor");
    }
    
    // Reconstruir a URL final
    let urlFinal: string;
    if (isExternalUrl) {
      urlFinal = urlObj.toString();
    } else {
      // Para rotas internas, usar apenas pathname + search
      urlFinal = urlObj.pathname + (urlObj.search ? urlObj.search : '');
    }
    
    // ✅ Log sempre (mesmo em produção) para debug
    console.log('🔄 Redirecionando para:', urlFinal, 'com empresa:', idParaSalvar, viaSupervisor === "supervisor" ? '(preservando via=supervisor)' : '');
    
    // Usar window.location.replace para redirecionamento imediato sem adicionar ao histórico
    if (urlFinal.startsWith('http://') || urlFinal.startsWith('https://')) {
      window.location.replace(urlFinal);
    } else {
      // Para rotas internas, usar window.location para forçar reload completo
      window.location.href = urlFinal;
    }
  }, [searchParams]);

  // Fallback: Verificar redirecionamento caso a verificação inicial tenha falhado
  // (apenas como segurança extra, mas a verificação inicial já deve ter coberto)
  useLayoutEffect(() => {
    if (redirecionadoRef.current || !podeFazerRequisicoes) return;
    
    if (!empresaData) return;

    // Prioridade 1: landingpage_store → /landingpage-store
    if (empresaData.landingpage_store) {
      const url = `/landingpage-store?empresa=${empresaData.id}`;
      if (process.env.NODE_ENV !== 'production') {
        console.log('Redirecionamento landingpage_store (fallback):', url);
      }
      setEmpresaData(empresaData);
      fazerRedirecionamento(url, empresaData, empresaData.id);
      return;
    }

    // Prioridade 2: redireciona_home + redireciona_home_para
    if (empresaData.redireciona_home && empresaData.redireciona_home_para) {
      const url = empresaData.redireciona_home_para.trim();
      if (url) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Redirecionamento encontrado em empresaData (fallback):', url);
        }
        setEmpresaData(empresaData);
        fazerRedirecionamento(url, empresaData, empresaData.id);
      }
    }
  }, [empresaData, podeFazerRequisicoes, fazerRedirecionamento]);

  // VERIFICAÇÃO INICIAL: Buscar empresa ANTES de qualquer outra requisição
  // Esta é a PRIMEIRA coisa que acontece - verifica redirecionamento antes de fazer outras requisições
  useEffect(() => {
    if (redirecionadoRef.current) return;

    // ✅ Ao mudar ?empresa= (ex.: 1→2), forçar re-verificação e loading até concluir
    setVerificandoRedirect(true);

    const verificarRedirecionamento = async () => {
      try {
        // Primeiro, verificar parâmetro da URL diretamente (para primeira visita)
        const empresaParam = searchParams.get("empresa");
        let empresaIdParaVerificar: number | null = null;
        
        if (empresaParam) {
          const raw = empresaParam.trim();
          if (/^\d+$/.test(raw)) {
            const parsed = parseInt(raw, 10);
            if (Number.isFinite(parsed) && parsed > 0) {
              empresaIdParaVerificar = parsed;
            }
          }
        }
        
        // Se não tem na URL, verificar do estado ou localStorage
        if (!empresaIdParaVerificar) {
          empresaIdParaVerificar = empresa_id_state || getEmpresaId();
        }
        
        // ✅ CORREÇÃO: Se já temos empresa válida no localStorage e não há parâmetro na URL,
        // verificar redirecionamento de forma mais rápida e permitir requisições
        if (empresaIdParaVerificar && !empresaParam) {
          const empresaSalva = getEmpresaData();
          // Se temos empresa salva e ela não redireciona, podemos habilitar requisições imediatamente
          if (empresaSalva && empresaSalva.id === empresaIdParaVerificar) {
            console.log('🔍 Verificando redirecionamento - empresaSalva.landingpage_store:', empresaSalva.landingpage_store, 'redireciona_home:', empresaSalva.redireciona_home, 'url:', empresaSalva.redireciona_home_para);
            if (empresaSalva.landingpage_store) {
              const url = `/landingpage-store?empresa=${empresaIdParaVerificar}`;
              console.log('🔄 Redirecionamento landingpage_store encontrado no localStorage:', url);
              setEmpresaId(empresaIdParaVerificar);
              fazerRedirecionamento(url, empresaSalva, empresaIdParaVerificar);
              return;
            }
            if (empresaSalva.redireciona_home && empresaSalva.redireciona_home_para) {
              const url = empresaSalva.redireciona_home_para?.trim();
              if (url) {
                console.log('🔄 Redirecionamento encontrado no localStorage:', url);
                setEmpresaId(empresaIdParaVerificar);
                fazerRedirecionamento(url, empresaSalva, empresaIdParaVerificar);
                return;
              }
              console.warn('⚠️ URL de redirecionamento vazia ou inválida');
            }
            // Não precisa redirecionar - habilitar requisições imediatamente
            console.log('✅ Empresa encontrada no localStorage sem redirecionamento - habilitando requisições');
            setPodeFazerRequisicoes(true);
            setVerificandoRedirect(false);
            return;
          } else {
            console.log('⚠️ Empresa salva não encontrada ou ID não confere');
          }
        }
        
        if (empresaIdParaVerificar) {
          // Primeiro, verificar localStorage (mais rápido)
          // IMPORTANTE: Verificar se os dados do localStorage são da empresa correta
          const empresaSalva = getEmpresaData();
          console.log('🔍 Verificando localStorage - empresaSalva:', empresaSalva ? `ID ${empresaSalva.id}, landingpage_store: ${empresaSalva.landingpage_store}, redireciona: ${empresaSalva.redireciona_home}, url: ${empresaSalva.redireciona_home_para}` : 'não encontrada');
          if (empresaSalva?.id === empresaIdParaVerificar) {
            if (empresaSalva.landingpage_store) {
              const url = `/landingpage-store?empresa=${empresaIdParaVerificar}`;
              console.log('🔄 Redirecionamento landingpage_store encontrado no localStorage:', url);
              setEmpresaId(empresaIdParaVerificar);
              fazerRedirecionamento(url, empresaSalva, empresaIdParaVerificar);
              return;
            }
            if (empresaSalva.redireciona_home && empresaSalva.redireciona_home_para) {
              const url = empresaSalva.redireciona_home_para.trim();
              if (url) {
                console.log('🔄 Redirecionamento encontrado no localStorage:', url);
                setEmpresaId(empresaIdParaVerificar);
                fazerRedirecionamento(url, empresaSalva, empresaIdParaVerificar);
                return;
              }
            }
          }
          
          // Se não encontrou no localStorage, buscar na API
          console.log('🔍 Buscando empresa na API para verificar redirecionamento...');
          
          const { data } = await api.get<EmpresaPublic | EmpresaPublic[]>("/api/empresas/public/emp/lista", {
            params: { empresa_id: empresaIdParaVerificar },
          });
          
          // Quando empresa_id é fornecido, a API retorna um objeto único
          const empresa = Array.isArray(data) ? data[0] : data;
          
          if (empresa) {
            console.log('🔍 Empresa encontrada na API - landingpage_store:', empresa.landingpage_store, 'redireciona:', empresa.redireciona_home, 'url:', empresa.redireciona_home_para);
            if (empresa.landingpage_store) {
              const url = `/landingpage-store?empresa=${empresaIdParaVerificar}`;
              console.log('🔄 Redirecionamento landingpage_store encontrado na API:', url);
              setEmpresaData(empresa);
              fazerRedirecionamento(url, empresa, empresaIdParaVerificar);
              return;
            }
            if (empresa.redireciona_home && empresa.redireciona_home_para) {
              const url = empresa.redireciona_home_para.trim();
              if (url) {
                console.log('🔄 Redirecionamento encontrado na API:', url);
                setEmpresaData(empresa);
                fazerRedirecionamento(url, empresa, empresaIdParaVerificar);
                return;
              }
            }
            console.log('ℹ️ Empresa não tem redirecionamento ativado');
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
              if (emp.landingpage_store) {
                const url = `/landingpage-store?empresa=${emp.id}`;
                if (process.env.NODE_ENV !== 'production') {
                  console.log('Redirecionamento landingpage_store encontrado na lista:', url);
                }
                setEmpresaData(emp);
                fazerRedirecionamento(url, emp, emp.id);
                return;
              }
              if (emp.redireciona_home && emp.redireciona_home_para) {
                const url = emp.redireciona_home_para.trim();
                if (url) {
                  if (process.env.NODE_ENV !== 'production') {
                    console.log('Redirecionamento encontrado na lista:', url);
                  }
                  setEmpresaData(emp);
                  fazerRedirecionamento(url, emp, emp.id);
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
  }, [empresa_id_state, searchParams, fazerRedirecionamento]);

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

  const q = searchParams.get("q") ?? "";
  const categorias = useMemo(
    () => filterCategoriasBySearch(data?.categorias ?? [], q),
    [data?.categorias, q]
  );
  const vitrinesRaw = data?.vitrines ?? [];
  const vitrines = useMemo(
    () => filterVitrinesBySearch(vitrinesRaw, q),
    [vitrinesRaw, q]
  );
  const vitrinesHome = useMemo(
    () => vitrines.filter((v) => v.is_home),
    [vitrines]
  );
  const bannersVerticais = data_banners?.filter((b) => b.tipo_banner === "V" && b.ativo) ?? [];
  const bannerVerticalPrincipal = bannersVerticais.length > 0 ? bannersVerticais[0] : null;

  // Verificar se loja está aberta
  useEffect(() => {
    setAgora(new Date());
    const interval = setInterval(() => {
      setAgora(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const lojaEstaAberta = useMemo(() => {
    if (!agora || !empresaData?.horarios_funcionamento) return true; // Se não há horários, permite adicionar
    return verificarLojaAberta(empresaData.horarios_funcionamento, undefined, agora);
  }, [empresaData?.horarios_funcionamento, agora]);

  const handleAdd = useCallback(
    (produto: ProdutoEmpMini, quantity: number, observacao?: string, complementos?: import("@cardapio/stores/cart/useCart").CartItemComplemento[]) => {
      // Bloquear adição se loja estiver fechada
      if (!lojaEstaAberta) {
        return;
      }

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
    [add, lojaEstaAberta]
  );

  // 🔽 AGORA o retorno é feito DENTRO do JSX
  // Se já redirecionou ou ainda está verificando, não renderizar nada
  if (redirecionado || redirecionadoRef.current || verificandoRedirect) {
    return null; // Não renderizar nada enquanto verifica ou após redirecionar
  }

  if (!ready)
    return (
      <>
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
          Carregando empresa...
        </div>
      </>
    );

  if (!empresa_id)
    return (
      <>
        <div className="min-h-screen flex items-center justify-center text-center p-4">
          <p className="text-muted-foreground text-sm">
            Nenhuma empresa selecionada. Verifique a URL ou volte para o início.
          </p>
        </div>
      </>
    );

  if (isError) return null;

  // ✅ Fluxo normal da home
  return (
    <div className="flex flex-col">
      <main className="flex-1 pt-4 pb-20">
        <CategoryScrollSection categorias={categorias} empresaId={empresa_id} />
        <BannerVertical banner={bannerVerticalPrincipal} isAdmin={isAdmin} />

        <div className="space-y-6">
          {vitrinesHome.map((v) => (
              <VitrineDestaques
                key={v.id}
                titulo={v.titulo}
                produtos={v.produtos}
                combos={v.combos}
                receitas={v.receitas}
                verMaisHref={
                  typeof v.href_categoria === "string" && v.href_categoria.startsWith("/cardapio/categoria/")
                    ? v.href_categoria.replace(/^\/cardapio/, "")
                    : v.href_categoria
                }
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
