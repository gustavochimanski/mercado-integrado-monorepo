"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "../ui/badge";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { ImageZoomDialog } from "../ui/image-zoom-dialog";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, X, ChevronDown } from "lucide-react";
import { useComplementosUnificado } from "@cardapio/services/complementos";
import { useState, useMemo, useRef, useEffect } from "react";
import type { ComplementoResponse, AdicionalComplementoResponse } from "@cardapio/types/complementos";
import { useCart } from "@cardapio/stores/cart/useCart";
import type { CartItemComplemento } from "@cardapio/stores/cart/useCart";
import { ComplementoSection } from "./ComplementoSection";
import { toast } from "sonner";
import { useLojaAberta } from "@cardapio/hooks/useLojaAberta";
import { Lock } from "lucide-react";

const isTruthyFlag = (v: unknown) =>
  v === true || v === 1 || v === "1" || v === "true" || v === "TRUE" || v === "S" || v === "s";

const schema = z.object({
  quantity: z
    .number({ invalid_type_error: "Quantidade inválida" })
    .int()
    .positive()
    .min(1)
    .max(99),
  observacao: z.string().max(200, "Observação muito longa").optional(),
});

type FormData = z.infer<typeof schema>;

interface SheetAdicionarProdutoProps {
  produto: ProdutoEmpMini;
  onAdd?: (produto: ProdutoEmpMini, quantity: number, observacao?: string, complementos?: CartItemComplemento[]) => void;
  isOpen: boolean;
  onClose: () => void;
  quickAddQuantity?: number;
  initialQuantity?: number;
  initialObservacao?: string;
  initialComplementos?: CartItemComplemento[];
}

export function SheetAdicionarProduto({
  produto,
  onAdd,
  isOpen,
  onClose,
  quickAddQuantity = 6,
  initialQuantity,
  initialObservacao,
  initialComplementos,
}: SheetAdicionarProdutoProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      quantity: initialQuantity ?? 1,
      observacao: initialObservacao ?? "",
    },
  });

  const { add } = useCart();
  const quantity = watch("quantity");
  const observacaoRegister = register("observacao");
  const { estaAberta } = useLojaAberta();
  const [observacaoModalOpen, setObservacaoModalOpen] = useState(false);
  const [observacaoDraft, setObservacaoDraft] = useState("");
  const observacaoAtual = watch("observacao") ?? "";

  const openObservacaoModal = () => {
    setObservacaoDraft(observacaoAtual);
    setObservacaoModalOpen(true);
  };
  
  // Buscar complementos do produto usando o endpoint unificado
  const { data: complementosDaAPI = [], isLoading: isLoadingComplementos, error: errorComplementos } = useComplementosUnificado(
    "produto",
    produto?.cod_barras,
    "delivery", // TODO: obter tipoPedido do contexto/store quando disponível
    true, // apenas ativos
    isOpen // só busca quando o sheet está aberto
  );

  // Filtrar apenas complementos ativos e com adicionais ativos
  const complementos: ComplementoResponse[] = useMemo(() => {
    if (!complementosDaAPI || complementosDaAPI.length === 0) {
      return [];
    }
    
    return complementosDaAPI
      .map((comp: ComplementoResponse) => {
        // Normalizar flags que podem vir como '1'/'0'/'true'/'false' da API
        const adicionaisAtivos = (comp.adicionais || []).filter((ad: AdicionalComplementoResponse) =>
          isTruthyFlag((ad as any).ativo)
        );

        return {
          ...comp,
          // Garantir booleanos corretos
          obrigatorio: isTruthyFlag((comp as any).obrigatorio),
          quantitativo: isTruthyFlag((comp as any).quantitativo),
          permite_multipla_escolha: isTruthyFlag((comp as any).permite_multipla_escolha),
          minimo_itens: comp.minimo_itens ? Number(comp.minimo_itens) : comp.minimo_itens,
          maximo_itens: comp.maximo_itens ? Number(comp.maximo_itens) : comp.maximo_itens,
          adicionais: adicionaisAtivos,
        } as ComplementoResponse;
      })
      .filter((comp: ComplementoResponse) => isTruthyFlag((comp as any).ativo) && comp.adicionais.length > 0);
  }, [complementosDaAPI]);

  // Debug: Log para verificar se os dados estão chegando
  if (typeof window !== 'undefined' && isOpen) {
    console.log('[SheetAddProduto] Debug:', {
      codBarras: produto?.cod_barras,
      codBarrasExists: !!produto?.cod_barras,
      isLoading: isLoadingComplementos,
      error: errorComplementos,
      complementosDaAPI,
      complementos,
      complementosLength: complementos?.length,
      isOpen,
      produto,
      queryEnabled: isOpen && !!produto?.cod_barras
    });
  }

  // Estado para complementos selecionados: mapeia complemento_id -> adicional_id -> quantidade
  const [selecoesComplementos, setSelecoesComplementos] = useState<Record<number, Record<number, number>>>({});

  // Inicializar valores quando o sheet abrir com valores iniciais
  useEffect(() => {
    if (isOpen) {
      if (initialQuantity !== undefined) {
        setValue("quantity", initialQuantity);
      }
      if (initialObservacao !== undefined) {
        setValue("observacao", initialObservacao);
      }
      
      // Inicializar complementos se fornecidos
      if (initialComplementos && initialComplementos.length > 0) {
        const novasSelecoes: Record<number, Record<number, number>> = {};
        initialComplementos.forEach(comp => {
          const adicionaisMap: Record<number, number> = {};
          comp.adicionais.forEach(adicional => {
            adicionaisMap[adicional.adicional_id] = adicional.quantidade;
          });
          novasSelecoes[comp.complemento_id] = adicionaisMap;
        });
        setSelecoesComplementos(novasSelecoes);
      } else {
        setSelecoesComplementos({});
      }
    }
  }, [isOpen, initialQuantity, initialObservacao, initialComplementos, setValue]);

  // Resetar seleção quando o sheet fecha
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelecoesComplementos({});
      reset({
        quantity: 1,
        observacao: "",
      });
      onClose();
    }
  };

  // Obter quantidade de um adicional em um complemento
  const getQuantidadeAdicional = (complementoId: number, adicionalId: number) => {
    return selecoesComplementos[complementoId]?.[adicionalId] || 0;
  };

  // Incrementar quantidade de um adicional em um complemento
  const incrementarAdicional = (complementoId: number, adicionalId: number, quantitativo: boolean) => {
    setSelecoesComplementos(prev => {
      const complemento = complementos.find(c => c.id === complementoId);
      if (!complemento) return prev;
      
      const complementoSelecoes = prev[complementoId] || {};
      const quantidadeAtual = complementoSelecoes[adicionalId] || 0;
      
      // Se não é quantitativo, sempre será 1
      let novaQuantidade = quantitativo ? quantidadeAtual + 1 : 1;
      
      // Validar máximo de itens do complemento
      if (complemento.maximo_itens && complemento.maximo_itens > 0) {
        const totalItens = Object.values(complementoSelecoes).reduce((sum, qtd) => sum + qtd, 0);
        // Se incrementando um adicional que já estava selecionado, não adiciona ao total
        const totalAposIncremento = totalItens - quantidadeAtual + novaQuantidade;
        if (totalAposIncremento > complemento.maximo_itens) {
          // Não permitir incrementar além do máximo
          return prev;
        }
      }
      
      return {
        ...prev,
        [complementoId]: {
          ...complementoSelecoes,
          [adicionalId]: novaQuantidade,
        },
      };
    });
  };

  // Decrementar quantidade de um adicional em um complemento
  const decrementarAdicional = (complementoId: number, adicionalId: number) => {
    setSelecoesComplementos(prev => {
      const complementoSelecoes = prev[complementoId] || {};
      const quantidadeAtual = complementoSelecoes[adicionalId] || 0;
      
      if (quantidadeAtual <= 1) {
        const novo = { ...complementoSelecoes };
        delete novo[adicionalId];
        
        // Se não há mais adicionais neste complemento, remover o complemento
        if (Object.keys(novo).length === 0) {
          const novoEstado = { ...prev };
          delete novoEstado[complementoId];
          return novoEstado;
        }
        
        return {
          ...prev,
          [complementoId]: novo,
        };
      }
      
      return {
        ...prev,
        [complementoId]: {
          ...complementoSelecoes,
          [adicionalId]: quantidadeAtual - 1,
        },
      };
    });
  };

  // Toggle adicional (para complementos que não permitem múltipla escolha)
  const toggleAdicional = (complementoId: number, adicionalId: number, permiteMultipla: boolean, quantitativo: boolean) => {
    const complemento = complementos.find(c => c.id === complementoId);
    if (!complemento) return;

    // Se for quantitativo, sempre usar incremento (soma) ao invés de toggle
    if (quantitativo) {
      incrementarAdicional(complementoId, adicionalId, quantitativo);
      return;
    }

    if (!permiteMultipla) {
      // Se não permite múltipla escolha, apenas um adicional pode ser selecionado
      // Desmarcar todos os outros adicionais deste complemento
      setSelecoesComplementos(prev => {
        const novo = { ...prev };
        const complementoSelecoes = novo[complementoId] || {};
        const estaSelecionado = complementoSelecoes[adicionalId] > 0;
        
        if (estaSelecionado) {
          // Desmarcar
          const novoComplemento = { ...complementoSelecoes };
          delete novoComplemento[adicionalId];
          
          if (Object.keys(novoComplemento).length === 0) {
            delete novo[complementoId];
          } else {
            novo[complementoId] = novoComplemento;
          }
        } else {
          // Marcar apenas este (remover todos os outros)
          novo[complementoId] = {
            [adicionalId]: 1,
          };
        }
        
        return novo;
      });
    } else {
      // Se permite múltipla escolha, pode incrementar
      incrementarAdicional(complementoId, adicionalId, quantitativo);
    }
  };

  // Calcular preço total incluindo complementos (considerando quantidades)
  const precoComplementosPorUnidade = useMemo(() => {
    let total = 0;
    Object.entries(selecoesComplementos).forEach(([complementoId, adicionaisSelecionados]) => {
      const complemento = complementos.find(c => c.id === Number(complementoId));
      if (!complemento) return;
      
      Object.entries(adicionaisSelecionados).forEach(([adicionalId, quantidade]) => {
        const adicional = complemento.adicionais.find(a => a.id === Number(adicionalId));
        if (adicional) {
          total += adicional.preco * quantidade;
        }
      });
    });
    return total;
  }, [selecoesComplementos, complementos]);

  const precoComplementosTotal = precoComplementosPorUnidade * quantity;
  const precoTotal = (produto.preco_venda * quantity) + precoComplementosTotal;

  function increment() {
    if (quantity < 99) setValue("quantity", quantity + 1);
  }

  function decrement() {
    if (quantity > 1) setValue("quantity", quantity - 1);
  }

  function addQuickQuantity() {
    const novaQuantidade = Math.min(quantity + quickAddQuantity, 99);
    setValue("quantity", novaQuantidade);
  }

  // IMPORTANTE: obrigatorio vem da vinculação, não do complemento em si
  const isComplementoObrigatorio = (complemento: ComplementoResponse) => {
    return complemento.obrigatorio === true;
  };

  // Validar se complementos obrigatórios foram selecionados
  // IMPORTANTE: TODOS os valores de configuração (obrigatorio, quantitativo, minimo_itens, maximo_itens) vêm da vinculação
  const validarComplementos = (): { valido: boolean; erro?: string } => {
    for (const complemento of complementos) {
      if (isComplementoObrigatorio(complemento)) {
        const selecoes = selecoesComplementos[complemento.id];
        if (!selecoes || Object.keys(selecoes).length === 0) {
          return {
            valido: false,
            erro: `É obrigatório selecionar ao menos um item em "${complemento.nome}"`,
          };
        }

        // Validar quantidade mínima (vem da vinculação)
        if (complemento.minimo_itens && complemento.minimo_itens > 0) {
          const totalItens = Object.values(selecoes).reduce((sum, qtd) => sum + qtd, 0);
          if (totalItens < complemento.minimo_itens) {
            return {
              valido: false,
              erro: `É necessário selecionar pelo menos ${complemento.minimo_itens} item(s) em "${complemento.nome}"`,
            };
          }
        }

        // Validar quantidade máxima (vem da vinculação)
        if (complemento.maximo_itens && complemento.maximo_itens > 0) {
          const totalItens = Object.values(selecoes).reduce((sum, qtd) => sum + qtd, 0);
          if (totalItens > complemento.maximo_itens) {
            return {
              valido: false,
              erro: `É possível selecionar no máximo ${complemento.maximo_itens} item(s) em "${complemento.nome}"`,
            };
          }
        }
      }
    }
    return { valido: true };
  };

  const [complementoHighlightId, setComplementoHighlightId] = useState<number | null>(null);
  const complementoRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Sempre voltar pro topo ao abrir (evita "parece que só complementos renderizou")
  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });
  }, [isOpen, produto?.cod_barras]);

  // Verificar se todos os complementos obrigatórios estão selecionados
  const todosComplementosObrigatoriosSelecionados = useMemo(() => {
    // Se ainda está carregando complementos, não desabilitar o botão
    if (isLoadingComplementos) {
      return true;
    }
    
    // Se não há complementos, não há nada para validar
    if (!complementos || complementos.length === 0) {
      return true;
    }
    
    // Verificar cada complemento obrigatório
    for (const complemento of complementos) {
      if (isComplementoObrigatorio(complemento)) {
        const selecoes = selecoesComplementos[complemento.id];
        if (!selecoes || Object.keys(selecoes).length === 0) {
          return false;
        }

        // Validar quantidade mínima
        if (complemento.minimo_itens && complemento.minimo_itens > 0) {
          const totalItens = Object.values(selecoes).reduce((sum, qtd) => sum + qtd, 0);
          if (totalItens < complemento.minimo_itens) {
            return false;
          }
        }
      }
    }
    
    return true;
  }, [complementos, selecoesComplementos, isLoadingComplementos]);

  const scrollParaComplementoObrigatorio = () => {
    const complementoNaoSelecionado = encontrarComplementoObrigatorioNaoSelecionado();
    if (!complementoNaoSelecionado) return;

    setComplementoHighlightId(complementoNaoSelecionado.id);

    const container = scrollContainerRef.current;
    const element = complementoRefs.current[complementoNaoSelecionado.id];
    if (!container || !element) return;

    // Scroll apenas dentro do sheet; nunca usar scrollIntoView (rola a página e pisca o overlay)
    requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const scrollTop = container.scrollTop;
      const elementTop = elementRect.top - containerRect.top + scrollTop;
      const centerOffset = container.clientHeight / 2 - elementRect.height / 2;
      const targetTop = Math.max(0, elementTop - centerOffset);

      container.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    });
  };

  // Encontrar o primeiro complemento obrigatório não selecionado
  const encontrarComplementoObrigatorioNaoSelecionado = (): ComplementoResponse | null => {
    for (const complemento of complementos) {
      if (isComplementoObrigatorio(complemento)) {
        const selecoes = selecoesComplementos[complemento.id];
        if (!selecoes || Object.keys(selecoes).length === 0) {
          return complemento;
        }

        // Validar quantidade mínima
        if (complemento.minimo_itens && complemento.minimo_itens > 0) {
          const totalItens = Object.values(selecoes).reduce((sum, qtd) => sum + qtd, 0);
          if (totalItens < complemento.minimo_itens) {
            return complemento;
          }
        }
      }
    }
    return null;
  };

  // Efeito para remover o highlight após a animação
  useEffect(() => {
    if (complementoHighlightId !== null) {
      const timer = setTimeout(() => {
        setComplementoHighlightId(null);
      }, 2000); // 2 segundos de animação
      return () => clearTimeout(timer);
    }
  }, [complementoHighlightId]);

  function onSubmit(data: FormData) {
    // Bloquear se loja estiver fechada
    if (!estaAberta) {
      toast.error("A loja está fechada no momento. Não é possível adicionar itens ao carrinho.");
      return;
    }

    // Converte string vazia para undefined para evitar enviar null ou ""
    const observacao = data.observacao?.trim() || undefined;
    
    // Validar complementos obrigatórios
    const validacao = validarComplementos();
    if (!validacao.valido) {
      toast.error(validacao.erro || "Erro de validação");

      scrollParaComplementoObrigatorio();
      return;
    }
    
    // Converter seleções para formato de complementos do carrinho
    const complementosSelecionados: CartItemComplemento[] = [];
    Object.entries(selecoesComplementos).forEach(([complementoId, adicionaisSelecionados]) => {
      const complemento = complementos.find(c => c.id === Number(complementoId));
      if (!complemento || Object.keys(adicionaisSelecionados).length === 0) return;
      
      const adicionais: Array<{ adicional_id: number; quantidade: number; adicional_nome?: string; adicional_preco?: number }> = [];
      Object.entries(adicionaisSelecionados).forEach(([adicionalId, quantidade]) => {
        const adicional = complemento.adicionais.find(a => a.id === Number(adicionalId));
        if (adicional) {
          adicionais.push({
            adicional_id: adicional.id,
            quantidade: quantidade,
            adicional_nome: adicional.nome,
            adicional_preco: adicional.preco,
          });
        }
      });
      
      if (adicionais.length > 0) {
        complementosSelecionados.push({
          complemento_id: complemento.id,
          adicionais,
          complemento_nome: complemento.nome,
        });
      }
    });
    
    if (onAdd) {
      // Passar complementos diretamente para o callback
      onAdd(produto, data.quantity, observacao, complementosSelecionados.length > 0 ? complementosSelecionados : undefined);
    } else {
      // Adicionar diretamente ao carrinho com complementos
      add({
        cod_barras: produto.cod_barras,
        nome: produto.produto.descricao,
        preco: produto.preco_venda,
        quantity: data.quantity,
        empresaId: produto.empresa_id ?? produto.empresa ?? 0,
        imagem: produto.produto.imagem ?? null,
        categoriaId: produto.produto.cod_categoria ?? undefined,
        subcategoriaId: produto.subcategoria_id ?? 0,
        observacao,
        complementos: complementosSelecionados.length > 0 ? complementosSelecionados : undefined,
      });
    }
    
    setValue("quantity", 1);
    setValue("observacao", "");
    setSelecoesComplementos({});
    onClose();
  }

  const imagem = produto.produto.imagem || "/semimagem.png";
  const descricao = produto.produto.descricao || "Sem nome";

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] w-full max-w-full rounded-t-3xl rounded-b-none p-0 bg-background overflow-hidden"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full min-h-0 relative">
          {/* Mantém o campo registrado no form (valor vem do modal) */}
          <input type="hidden" {...observacaoRegister} />
          {/* Botão de fechar customizado */}
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="absolute top-4 right-4 z-60 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2 text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Conteúdo Scrollável — overscroll-contain evita scroll propagar pro body (evita rolar tela e piscar) */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain relative"
          >
            {/* Imagem Hero no Topo */}
            <div className="relative w-full h-[280px] md:h-[320px] overflow-hidden bg-muted">
              <ImageZoomDialog
                src={imagem}
                alt={descricao}
                priority
                className="w-full h-full relative"
              />
              <div className="absolute inset-0 pointer-events-none z-10" />
              
              {/* Badge de desconto flutuante */}
              <div className="absolute top-4 left-4 z-20 pointer-events-auto">
                <Badge className="bg-red-500 text-white font-bold text-sm px-3 py-1 shadow-lg">
                  -20% OFF
                </Badge>
              </div>
            </div>

            {/* Seta indicando para rolar para baixo (abaixo da imagem) */}
            <div className="flex justify-center pointer-events-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/60 backdrop-blur-sm shadow-sm  animate-bounce">
                <ChevronDown className="h-6 w-6 text-white/90 drop-shadow-lg " />
              </div>
            </div>

            <div className="px-4 -mt-8">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold leading-tight text-left mb-2">
                {descricao}
              </SheetTitle>
              <div className="flex items-center justify-between mt-2">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Preço unitário</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {produto.preco_venda.toFixed(2).replace(".", ",")}
                  </span>
                  {precoComplementosPorUnidade > 0 && (
                    <span className="text-xs text-muted-foreground mt-1">
                      + R$ {precoComplementosTotal.toFixed(2).replace(".", ",")} em complementos
                      {quantity > 1 && (
                        <span className="ml-1">
                          (R$ {precoComplementosPorUnidade.toFixed(2).replace(".", ",")} / un.)
                        </span>
                      )}
                    </span>
                  )}
                </div>
                {(quantity > 1 || precoComplementosPorUnidade > 0) && (
                  <div className="flex flex-col items-end">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-xl font-semibold text-foreground">
                      R$ {precoTotal.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                )}
              </div>
            </SheetHeader>

            {/* Seção de Quantidade */}
            <div className="space-y-4 mb-6">
              <Label htmlFor="quantity" className="text-base font-semibold">
                Quantidade
              </Label>
              
              {/* Controles de Quantidade */}
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-2 hover:bg-muted transition-all"
                  onClick={decrement}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                
                <div className="flex-1 flex flex-col items-center">
                  <Input
                    type="number"
                    id="quantity"
                    {...register("quantity", { valueAsNumber: true })}
                    className="text-center text-2xl font-bold h-14 border-2 focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <span className="text-xs text-muted-foreground mt-1">
                    {quantity === 1 ? "unidade" : "unidades"}
                  </span>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-2 hover:bg-muted transition-all"
                  onClick={increment}
                  disabled={quantity >= 99}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              {/* Botão de Adição Rápida */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed hover:border-solid hover:bg-muted/50 transition-all"
                onClick={addQuickQuantity}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar {quickAddQuantity} unidades
              </Button>

              {errors.quantity && (
                <p className="text-destructive text-sm font-medium">{errors.quantity.message}</p>
              )}
            </div>

            {/* Divisor */}
            <div className="border-t border-border my-6" />

            {/* Seção de Complementos - Sempre mostrar para debug */}
            <div className="space-y-3 mb-6">
              <Label className="text-base font-semibold">Complementos</Label>
              
              {isLoadingComplementos ? (
                <p className="text-sm text-muted-foreground">Carregando complementos...</p>
              ) : errorComplementos ? (
                <div className="space-y-2">
                  <p className="text-sm text-destructive">
                    Erro ao carregar complementos: {errorComplementos instanceof Error ? errorComplementos.message : "Erro desconhecido"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Debug: codBarras={produto?.cod_barras || "undefined"}, isOpen={String(isOpen)}
                  </p>
                </div>
              ) : complementos && complementos.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {complementos.length} complemento{complementos.length > 1 ? "s" : ""} disponível{complementos.length > 1 ? "eis" : ""}
                    </span>
                    {Object.keys(selecoesComplementos).length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        + R$ {precoComplementosTotal.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </div>

                  {complementos.map((complemento) => (
                    <div
                      key={complemento.id}
                      ref={(el) => {
                        complementoRefs.current[complemento.id] = el;
                      }}
                    >
                      <ComplementoSection
                        complemento={complemento}
                        selecoes={selecoesComplementos[complemento.id] || {}}
                        getQuantidade={(adicionalId) => getQuantidadeAdicional(complemento.id, adicionalId)}
                        quantidadeItem={quantity}
                        onToggle={(adicionalId) => toggleAdicional(complemento.id, adicionalId, complemento.permite_multipla_escolha, complemento.quantitativo)}
                        onIncrement={(adicionalId) => incrementarAdicional(complemento.id, adicionalId, complemento.quantitativo)}
                        onDecrement={(adicionalId) => decrementarAdicional(complemento.id, adicionalId)}
                        highlight={complementoHighlightId === complemento.id}
                      />
                    </div>
                  ))}
                </div>
              ) : complementosDaAPI && complementosDaAPI.length > 0 && complementos.length === 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Nenhum complemento ativo disponível para este produto.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Debug: {complementosDaAPI.length} complemento{complementosDaAPI.length > 1 ? "s" : ""} da API, mas nenhum passou no filtro (ativo + adicionais ativos).
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Este produto não possui complementos disponíveis.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Debug: codBarras={produto?.cod_barras || "undefined"}, complementosDaAPI={complementosDaAPI?.length || 0}
                  </p>
                </div>
              )}
            </div>

            {/* Divisor */}
            {complementos.length > 0 && <div className="border-t border-border my-6" />}

            {/* Campo de Observação */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="observacao" className="text-base font-semibold">
                  Observações
                </Label>
                <span className="text-xs text-muted-foreground">
                  Opcional
                </span>
              </div>
              <button
                type="button"
                onClick={openObservacaoModal}
                className="w-full min-h-[100px] rounded-xl border-2 bg-background px-3 py-3 text-left transition-colors hover:bg-muted/30 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Editar observações"
              >
                <span className={observacaoAtual ? "text-sm whitespace-pre-wrap" : "text-sm text-muted-foreground"}>
                  {observacaoAtual || "Toque para adicionar observações (ex: sem cebola, ponto médio, embalagem separada...)"} 
                </span>
              </button>
              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {watch("observacao")?.length || 0}/200 caracteres
                </span>
              </div>
              {errors.observacao && (
                <p className="text-destructive text-sm font-medium">{errors.observacao.message}</p>
              )}
            </div>

            <Dialog open={observacaoModalOpen} onOpenChange={setObservacaoModalOpen}>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Observações</DialogTitle>
                  <DialogDescription>
                    Escreva aqui os detalhes do seu pedido (máx. 200 caracteres).
                  </DialogDescription>
                </DialogHeader>

                <Textarea
                  id="observacao-modal"
                  autoFocus
                  value={observacaoDraft}
                  onChange={(e) => setObservacaoDraft(e.target.value)}
                  maxLength={200}
                  rows={6}
                  className="min-h-[160px] resize-none border-2 focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="Ex: sem cebola, ponto médio, embalagem separada, sem tomate..."
                />
                <div className="flex justify-end">
                  <span className="text-xs text-muted-foreground">
                    {observacaoDraft.length}/200 caracteres
                  </span>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setObservacaoModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setValue("observacao", observacaoDraft, { shouldDirty: true, shouldValidate: true });
                      setObservacaoModalOpen(false);
                    }}
                  >
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Botão de Adicionar ao Carrinho - Dentro do scroll */}
            <div className="border-t border-border pt-4 pb-6 px-4">
              <Button 
                type="button"
                aria-disabled={!estaAberta}
                disabled={!estaAberta}
                className={`w-full h-14 text-base font-semibold shadow-lg transition-all ${
                  !estaAberta
                    ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                    : todosComplementosObrigatoriosSelecionados
                      ? "bg-primary text-background hover:shadow-xl hover:bg-primary/90"
                      : "border-2 border-primary bg-primary/10 text-primary hover:bg-primary/20"
                }`}
                size="lg"
                onClick={(e) => {
                  if (!estaAberta) {
                    e.preventDefault();
                    toast.error("A loja está fechada no momento. Não é possível adicionar itens ao carrinho.");
                    return;
                  }

                  if (!todosComplementosObrigatoriosSelecionados) {
                    e.preventDefault();
                    const validacao = validarComplementos();
                    if (!validacao.valido) {
                      toast.error(validacao.erro || "Erro de validação");
                    }
                    scrollParaComplementoObrigatorio();
                    return;
                  }

                  handleSubmit(onSubmit)();
                }}
              >
                {estaAberta ? (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Adicionar ao Carrinho • R$ {precoTotal.toFixed(2).replace(".", ",")}
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Loja Fechada
                  </>
                )}
              </Button>
            </div>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}