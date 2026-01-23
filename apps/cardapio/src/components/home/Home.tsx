"use client";

import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoginWrapper } from "@cardapio/components/auth/LoginWrapper";
import { useHome } from "@cardapio/services/home";
import { useCart } from "@cardapio/stores/cart/useCart";
import { CartFab } from "@cardapio/components/Shared/cart/CartSuspense";
import { CartSheet } from "@cardapio/components/Shared/cart/CartSheet";
import { useReceiveEmpresaFromQuery } from "@cardapio/stores/empresa/useReceiveEmpresaFromQuery";
import { getEmpresaId, setEmpresaId, setMesaInicial, getEmpresaData, setEmpresaData } from "@cardapio/stores/empresa/empresaStore";
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

  // ✅ CORREÇÃO: Garantir que ready seja setado quando empresa_id já existe na inicialização
  useEffect(() => {
    const currentId = getEmpresaId();
    if (currentId && currentId !== empresa_id) {
      setEmpresaIdState(currentId);
      setReady(true);
    } else if (currentId && currentId > 0) {
      // Se já temos uma empresa válida, setar ready imediatamente
      setReady(true);
    }
  }, [empresa_id]);

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
    let urlFinal = url;
    
    if (viaSupervisor === "supervisor") {
      // Verificar se a URL já tem parâmetros de query
      const isExternalUrl = url.startsWith('http://') || url.startsWith('https://');
      const urlObj = isExternalUrl 
        ? new URL(url)
        : new URL(url, window.location.origin);
      
      // Se já tiver via na URL de redirecionamento, não sobrescrever
      if (!urlObj.searchParams.has("via")) {
        urlObj.searchParams.set("via", "supervisor");
      }
      
      // Reconstruir a URL final
      if (isExternalUrl) {
        urlFinal = urlObj.toString();
      } else {
        // Para rotas internas, usar apenas pathname + search
        urlFinal = urlObj.pathname + (urlObj.search ? urlObj.search : '');
      }
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
    
    // Se empresaData carregou e tem redirecionamento, redirecionar (fallback)
    if (empresaData?.redireciona_home && empresaData?.redireciona_home_para) {
      const url = empresaData.redireciona_home_para.trim();
      if (url) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Redirecionamento encontrado em empresaData (fallback):', url);
        }
        // Garantir que empresa está salva antes de redirecionar
        setEmpresaData(empresaData);
        fazerRedirecionamento(url, empresaData, empresaData.id);
      }
    }
  }, [empresaData, podeFazerRequisicoes, fazerRedirecionamento]);

  // VERIFICAÇÃO INICIAL: Buscar empresa ANTES de qualquer outra requisição
  // Esta é a PRIMEIRA coisa que acontece - verifica redirecionamento antes de fazer outras requisições
  useEffect(() => {
    if (redirecionadoRef.current) return;
    
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
          empresaIdParaVerificar = empresa_id || getEmpresaId();
        }
        
        // ✅ CORREÇÃO: Se já temos empresa válida no localStorage e não há parâmetro na URL,
        // verificar redirecionamento de forma mais rápida e permitir requisições
        if (empresaIdParaVerificar && !empresaParam) {
          const empresaSalva = getEmpresaData();
          // Se temos empresa salva e ela não redireciona, podemos habilitar requisições imediatamente
          if (empresaSalva && empresaSalva.id === empresaIdParaVerificar) {
            console.log('🔍 Verificando redirecionamento - empresaSalva.redireciona_home:', empresaSalva.redireciona_home, 'url:', empresaSalva.redireciona_home_para);
            if (!empresaSalva.redireciona_home || !empresaSalva.redireciona_home_para) {
              // Não precisa redirecionar - habilitar requisições imediatamente
              console.log('✅ Empresa encontrada no localStorage sem redirecionamento - habilitando requisições');
              setPodeFazerRequisicoes(true);
              setVerificandoRedirect(false);
              return;
            } else {
              // Tem redirecionamento - executar
              const url = empresaSalva.redireciona_home_para?.trim();
              if (url) {
                console.log('🔄 Redirecionamento encontrado no localStorage:', url);
                setEmpresaId(empresaIdParaVerificar);
                fazerRedirecionamento(url, empresaSalva, empresaIdParaVerificar);
                return;
              } else {
                console.warn('⚠️ URL de redirecionamento vazia ou inválida');
              }
            }
          } else {
            console.log('⚠️ Empresa salva não encontrada ou ID não confere');
          }
        }
        
        if (empresaIdParaVerificar) {
          // Primeiro, verificar localStorage (mais rápido)
          const empresaSalva = getEmpresaData();
          console.log('🔍 Verificando localStorage - empresaSalva:', empresaSalva ? `ID ${empresaSalva.id}, redireciona: ${empresaSalva.redireciona_home}, url: ${empresaSalva.redireciona_home_para}` : 'não encontrada');
          if (empresaSalva?.redireciona_home && empresaSalva?.redireciona_home_para && empresaSalva?.id === empresaIdParaVerificar) {
            const url = empresaSalva.redireciona_home_para.trim();
            if (url) {
              console.log('🔄 Redirecionamento encontrado no localStorage:', url);
              // Garantir que empresaId está salvo antes de redirecionar
              setEmpresaId(empresaIdParaVerificar);
              fazerRedirecionamento(url, empresaSalva, empresaIdParaVerificar);
              return;
            }
          }
          
          // Se não encontrou no localStorage, buscar na API
          console.log('🔍 Buscando empresa na API para verificar redirecionamento...');
          
          const { data } = await api.get<EmpresaPublic[]>("/api/empresas/public/emp/lista", {
            params: { empresa_id: empresaIdParaVerificar },
          });
          
          if (Array.isArray(data) && data.length > 0) {
            const empresa = data[0];
            console.log('🔍 Empresa encontrada na API - redireciona:', empresa.redireciona_home, 'url:', empresa.redireciona_home_para);
            if (empresa.redireciona_home && empresa.redireciona_home_para) {
              const url = empresa.redireciona_home_para.trim();
              if (url) {
                console.log('🔄 Redirecionamento encontrado na API:', url);
                // Salvar empresa completa antes de redirecionar
                setEmpresaData(empresa);
                fazerRedirecionamento(url, empresa, empresaIdParaVerificar);
                return;
              }
            } else {
              console.log('ℹ️ Empresa não tem redirecionamento ativado');
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
                  // Salvar empresa completa antes de redirecionar
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
  }, [empresa_id, searchParams, fazerRedirecionamento]);

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
      <>
        <LoginWrapper />
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
          Carregando empresa...
        </div>
      </>
    );

  if (!empresa_id)
    return (
      <>
        <LoginWrapper />
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
