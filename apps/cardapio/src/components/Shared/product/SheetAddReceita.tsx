"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "../ui/badge";
import { ReceitaMiniDTO } from "@cardapio/services/home";
import { ImageZoomDialog } from "../ui/image-zoom-dialog";
import { Minus, Plus, ShoppingCart, X, ChevronDown } from "lucide-react";
import { useComplementosUnificado } from "@cardapio/services/complementos";
import { useState, useMemo, useRef, useEffect } from "react";
import type { ComplementoResponse, AdicionalComplementoResponse as AdicionalComplemento } from "@cardapio/types/complementos";
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

interface SheetAdicionarReceitaProps {
  receita: ReceitaMiniDTO;
  onAdd?: (receita: ReceitaMiniDTO, quantity: number, observacao?: string, complementos?: CartItemComplemento[]) => void;
  isOpen: boolean;
  onClose: () => void;
  quickAddQuantity?: number;
}

export function SheetAdicionarReceita({
  receita,
  onAdd,
  isOpen,
  onClose,
  quickAddQuantity = 6,
}: SheetAdicionarReceitaProps) {
  const { addReceita } = useCart();
  const { estaAberta } = useLojaAberta();
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
      quantity: 1,
      observacao: "",
    },
  });

  const quantity = watch("quantity");
  
  // Buscar complementos da receita usando o endpoint unificado
  const { data: complementosDaAPI = [], isLoading: isLoadingComplementos, error: errorComplementos } = useComplementosUnificado(
    "receita",
    receita?.id, // ID da receita
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
      .map(comp => ({
        ...comp,
        adicionais: (comp.adicionais || []).filter((ad: AdicionalComplemento) => isTruthyFlag((ad as any).ativo))
      }))
      .filter(comp => isTruthyFlag((comp as any).ativo) && comp.adicionais.length > 0);
  }, [complementosDaAPI]);

  // Debug: Log para verificar se os dados estão chegando
  if (typeof window !== 'undefined' && isOpen) {
    console.log('[SheetAddReceita] Debug:', {
      receitaId: receita?.id,
      isLoading: isLoadingComplementos,
      error: errorComplementos,
      complementosDaAPI,
      complementos,
      isOpen
    });
  }

  // Estado para complementos selecionados: mapeia complemento_id -> adicional_id -> quantidade
  const [selecoesComplementos, setSelecoesComplementos] = useState<Record<number, Record<number, number>>>({});

  // Resetar seleção quando o sheet fecha
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelecoesComplementos({});
      reset();
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
          novaQuantidade = complemento.maximo_itens - (totalItens - quantidadeAtual);
          if (novaQuantidade <= 0) return prev; // Já atingiu o máximo
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
  const precoComplementos = useMemo(() => {
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

  const precoTotal = (receita.preco_venda + precoComplementos) * quantity;

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

  // Sempre voltar pro topo ao abrir (evita reabrir já no meio da lista)
  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });
  }, [isOpen, receita?.id]);

  // Verificar se todos os complementos obrigatórios estão selecionados
  const todosComplementosObrigatoriosSelecionados = useMemo(() => {
    if (isLoadingComplementos) {
      return true;
    }
    if (!complementos || complementos.length === 0) {
      return true;
    }

    for (const complemento of complementos) {
      if (isComplementoObrigatorio(complemento)) {
        const selecoes = selecoesComplementos[complemento.id];
        if (!selecoes || Object.keys(selecoes).length === 0) {
          return false;
        }

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

  // Encontrar o primeiro complemento obrigatório não selecionado
  const encontrarComplementoObrigatorioNaoSelecionado = (): ComplementoResponse | null => {
    for (const complemento of complementos) {
      if (isComplementoObrigatorio(complemento)) {
        const selecoes = selecoesComplementos[complemento.id];
        if (!selecoes || Object.keys(selecoes).length === 0) {
          return complemento;
        }

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

  useEffect(() => {
    if (complementoHighlightId !== null) {
      const timer = setTimeout(() => {
        setComplementoHighlightId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [complementoHighlightId]);

  function onSubmit(data: FormData) {
    // Bloquear se loja estiver fechada
    if (!estaAberta) {
      toast.error("A loja está fechada no momento. Não é possível adicionar itens ao carrinho.");
      return;
    }

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
      onAdd(receita, data.quantity, observacao, complementosSelecionados.length > 0 ? complementosSelecionados : undefined);
    } else {
      // Adicionar diretamente ao carrinho
      addReceita({
        receita_id: receita.id,
        nome: receita.nome,
        quantidade: data.quantity,
        preco: receita.preco_venda,
        observacao,
        complementos: complementosSelecionados.length > 0 ? complementosSelecionados : undefined,
      });
    }

    setValue("quantity", 1);
    setValue("observacao", "");
    setSelecoesComplementos({});
    onClose();
  }

  const imagem = receita.imagem || "/semimagem.png";
  const nome = receita.nome || receita.descricao || "Sem nome";

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] w-full max-w-full rounded-t-3xl rounded-b-none p-0 bg-background overflow-hidden"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full min-h-0 relative">
          {/* Botão de fechar customizado */}
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="absolute top-4 right-4 z-[60] rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2 text-white transition-colors"
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
              {/* Seta indicando para rolar para baixo */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <ChevronDown className="h-6 w-6 text-white/90 drop-shadow-lg animate-bounce-down" />
              </div>
              <ImageZoomDialog
                src={imagem}
                alt={nome}
                priority
                className="w-full h-full relative"
              />
              <div className="absolute inset-0 pointer-events-none z-10" />
            </div>

            <div className="px-4 pt-4">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold leading-tight text-left mb-2">
                {nome}
              </SheetTitle>
              {receita.descricao && receita.descricao !== nome && (
                <p className="text-sm text-muted-foreground mt-2">
                  {receita.descricao}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Preço unitário</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {receita.preco_venda.toFixed(2).replace(".", ",")}
                  </span>
                  {precoComplementos > 0 && (
                    <span className="text-xs text-muted-foreground mt-1">
                      + R$ {precoComplementos.toFixed(2).replace(".", ",")} em complementos
                    </span>
                  )}
                </div>
                {(quantity > 1 || precoComplementos > 0) && (
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

            {/* Seção de Complementos */}
            {isLoadingComplementos ? (
              <div className="space-y-3 mb-6">
                <Label className="text-base font-semibold">Complementos</Label>
                <p className="text-sm text-muted-foreground">Carregando complementos...</p>
              </div>
            ) : errorComplementos ? (
              <div className="space-y-3 mb-6">
                <Label className="text-base font-semibold">Complementos</Label>
                <p className="text-sm text-destructive">
                  Erro ao carregar complementos: {errorComplementos instanceof Error ? errorComplementos.message : "Erro desconhecido"}
                </p>
              </div>
            ) : complementos && complementos.length > 0 ? (
              <div className="space-y-6 mb-6">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Complementos</Label>
                  <span className="text-xs text-muted-foreground">
                    {Object.keys(selecoesComplementos).length > 0 && `+ R$ ${precoComplementos.toFixed(2).replace(".", ",")}`}
                  </span>
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
                      onToggle={(adicionalId) => toggleAdicional(complemento.id, adicionalId, complemento.permite_multipla_escolha, complemento.quantitativo)}
                      onIncrement={(adicionalId) => incrementarAdicional(complemento.id, adicionalId, complemento.quantitativo)}
                      onDecrement={(adicionalId) => decrementarAdicional(complemento.id, adicionalId)}
                      highlight={complementoHighlightId === complemento.id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                <Label className="text-base font-semibold">Complementos</Label>
                <p className="text-sm text-muted-foreground">Esta receita não possui complementos disponíveis.</p>
              </div>
            )}

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
              <Textarea
                id="observacao"
                placeholder="Ex: sem cebola, ponto médio, embalagem separada..."
                {...register("observacao")}
                maxLength={200}
                className="min-h-[100px] resize-none border-2 focus-visible:ring-2 focus-visible:ring-primary"
                rows={4}
              />
              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {watch("observacao")?.length || 0}/200 caracteres
                </span>
              </div>
              {errors.observacao && (
                <p className="text-destructive text-sm font-medium">{errors.observacao.message}</p>
              )}
            </div>

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
                    {`Adicionar ao Carrinho • R$ ${precoTotal.toFixed(2).replace(".", ",")}`}
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

