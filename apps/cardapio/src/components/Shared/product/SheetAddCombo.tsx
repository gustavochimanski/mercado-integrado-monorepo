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
import { ComboMiniDTO } from "@cardapio/services/home";
import { ImageZoomDialog } from "../ui/image-zoom-dialog";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, X, ChevronDown } from "lucide-react";
import { useComplementosUnificado } from "@cardapio/services/complementos";
import { useState, useMemo, useEffect, useRef } from "react";
import type { ComplementoResponse, AdicionalComplementoResponse as AdicionalComplemento } from "@cardapio/types/complementos";
import { useCart } from "@cardapio/stores/cart/useCart";
import type { CartItemComplemento } from "@cardapio/stores/cart/useCart";
import { ComplementoSection } from "./ComplementoSection";
import { toast } from "sonner";
import { useLojaAberta } from "@cardapio/hooks/useLojaAberta";
import { Lock } from "lucide-react";
import { validarSelecoesCombo, CartComboSection, SectionDefinition } from "../../../utils/validacoesCombos";

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

interface SheetAdicionarComboProps {
  combo: ComboMiniDTO;
  onAdd?: (combo: ComboMiniDTO, quantity: number, observacao?: string, complementos?: CartItemComplemento[], secoes?: CartComboSection[]) => void;
  isOpen: boolean;
  onClose: () => void;
  quickAddQuantity?: number;
}

export function SheetAdicionarCombo({
  combo,
  onAdd,
  isOpen,
  onClose,
  quickAddQuantity = 6,
}: SheetAdicionarComboProps) {
  const { addCombo } = useCart();
  const { estaAberta } = useLojaAberta();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
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
  const observacaoRegister = register("observacao");
  const [observacaoModalOpen, setObservacaoModalOpen] = useState(false);
  const [observacaoDraft, setObservacaoDraft] = useState("");
  const observacaoAtual = watch("observacao") ?? "";

  const openObservacaoModal = () => {
    setObservacaoDraft(observacaoAtual);
    setObservacaoModalOpen(true);
  };
  
  // Buscar complementos do combo usando o endpoint unificado
  const { data: complementosDaAPI = [], isLoading: isLoadingComplementos, error: errorComplementos } = useComplementosUnificado(
    "combo",
    combo?.id, // ID do combo
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
    console.log('[SheetAddCombo] Debug:', {
      comboId: combo?.id,
      isLoading: isLoadingComplementos,
      error: errorComplementos,
      complementosDaAPI,
      complementos,
      isOpen
    });
  }

  // Estado para complementos selecionados: mapeia complemento_id -> adicional_id -> quantidade
  const [selecoesComplementos, setSelecoesComplementos] = useState<Record<number, Record<number, number>>>({});
  const [highlightedSections, setHighlightedSections] = useState<number[]>([]);

  // Sempre voltar pro topo ao abrir (evita reabrir já em "Complementos")
  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    });
  }, [isOpen, combo?.id]);

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
    // remover highlight desta seção ao interagir
    setHighlightedSections(prev => prev.filter(id => id !== complementoId));
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
    // remover highlight desta seção ao interagir
    setHighlightedSections(prev => prev.filter(id => id !== complementoId));
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
      // remover highlight desta seção ao interagir
      setHighlightedSections(prev => prev.filter(id => id !== complementoId));
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
  const precoTotal = (combo.preco_total * quantity) + precoComplementosTotal;

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
  const validarComplementos = (): { valido: boolean; erro?: string; invalidIds?: number[] } => {
    const invalidIds: number[] = [];

    for (const complemento of complementos) {
      const selecoes = selecoesComplementos[complemento.id] || {};
      const totalItens = Object.values(selecoes).reduce((sum, qtd) => sum + qtd, 0);

      if (isComplementoObrigatorio(complemento) && totalItens === 0) {
        invalidIds.push(complemento.id);
        continue;
      }

      if (complemento.minimo_itens && complemento.minimo_itens > 0 && totalItens < complemento.minimo_itens) {
        invalidIds.push(complemento.id);
        continue;
      }

      if (complemento.maximo_itens && complemento.maximo_itens > 0 && totalItens > complemento.maximo_itens) {
        invalidIds.push(complemento.id);
        continue;
      }
    }

    if (invalidIds.length > 0) {
      const first = complementos.find(c => c.id === invalidIds[0]);
      const erroMsg = first ? `Verifique a seção "${first.nome}"` : "Seleções inválidas nos complementos";
      return { valido: false, erro: erroMsg, invalidIds };
    }

    return { valido: true };
  };

  function onSubmit(data: FormData) {
    // Bloquear se loja estiver fechada
    if (!estaAberta) {
      toast.error("A loja está fechada no momento. Não é possível adicionar itens ao carrinho.");
      return;
    }

    const observacao = data.observacao?.trim() || undefined;
    
    // Validar complementos obrigatórios (com destaque das seções inválidas)
    const validacao = validarComplementos();
    if (!validacao.valido) {
      // marcar seções inválidas
      setHighlightedSections(validacao.invalidIds || []);
      // scroll para a primeira seção inválida (dentro do container)
      const firstId = validacao.invalidIds && validacao.invalidIds[0];
      if (firstId && scrollContainerRef.current) {
        const el = scrollContainerRef.current.querySelector(`[data-complemento-id="${firstId}"]`) as HTMLElement | null;
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      toast.error(validacao.erro || "Erro de validação");
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
    // Construir estrutura de seções (uso interno/persistência) a partir das seleções
    const secoesSelecionadas: CartComboSection[] = complementosSelecionados.map(c => ({
      secao_id: c.complemento_id,
      itens: c.adicionais.map(a => ({ id: a.adicional_id, quantidade: a.quantidade })),
    }));

    // Construir definições simples das seções para validação detalhada (quando necessário)
    const defs: SectionDefinition[] = complementos.map(comp => ({
      id: comp.id,
      obrigatorio: comp.obrigatorio === true,
      quantitativo: comp.quantitativo === true,
      minimo_itens: typeof comp.minimo_itens !== "undefined" ? comp.minimo_itens ?? undefined : undefined,
      maximo_itens: typeof comp.maximo_itens !== "undefined" ? comp.maximo_itens ?? undefined : undefined,
      itens: comp.adicionais ? comp.adicionais.map(a => ({
        id: a.id,
        permite_quantidade: comp.quantitativo === true,
        quantidade_min: 1,
        quantidade_max: comp.maximo_itens ?? undefined,
      })) : undefined,
    }));

    // Validar via função genérica (cobre regras por item e por seção)
    const validacaoGlobal = validarSelecoesCombo(combo.id, secoesSelecionadas, defs);
    if (!validacaoGlobal.valido) {
      toast.error(validacaoGlobal.erro || "Erro de validação do combo");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (onAdd) {
      onAdd(combo, data.quantity, observacao, complementosSelecionados.length > 0 ? complementosSelecionados : undefined, secoesSelecionadas.length > 0 ? secoesSelecionadas : undefined);
    } else {
      // Adicionar diretamente ao carrinho
      addCombo({
        combo_id: combo.id,
        nome: combo.titulo,
        quantidade: data.quantity,
        preco: combo.preco_total,
        observacao,
        complementos: complementosSelecionados.length > 0 ? complementosSelecionados : undefined,
        secoes: secoesSelecionadas.length > 0 ? secoesSelecionadas : undefined,
      });
    }

    setValue("quantity", 1);
    setValue("observacao", "");
    setSelecoesComplementos({});
    onClose();
  }

  const imagem = combo.imagem || "/semimagem.png";
  const titulo = combo.titulo || "Sem nome";

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

          {/* Conteúdo Scrollável — overscroll-contain evita scroll propagar pro body */}
          <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain relative">
            {/* Imagem Hero no Topo */}
            <div className="relative w-full h-[280px] md:h-[320px] overflow-hidden bg-muted">
              <ImageZoomDialog
                src={imagem}
                alt={titulo}
                priority
                className="w-full h-full relative"
              />
              <div className="absolute inset-0 pointer-events-none z-10" />
            </div>

            {/* Seta indicando para rolar para baixo (abaixo da imagem) */}
            <div className="-mt-4 flex justify-center pb-2 pointer-events-none">
              <div className="flex h-9 w-12 items-center justify-center rounded-full bg-primary/60 backdrop-blur-sm shadow-sm">
                <ChevronDown className="h-6 w-6 text-white/90 drop-shadow-lg animate-bounce-down" />
              </div>
            </div>

            <div className="px-4 pt-4">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold leading-tight text-left mb-2">
                {titulo}
              </SheetTitle>
              {combo.descricao && (
                <p className="text-sm text-muted-foreground mt-2">
                  {combo.descricao}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Preço unitário</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {combo.preco_total.toFixed(2).replace(".", ",")}
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
                    {Object.keys(selecoesComplementos).length > 0 && `+ R$ ${precoComplementosTotal.toFixed(2).replace(".", ",")}`}
                  </span>
                </div>

                {complementos.map((complemento) => (
                  <ComplementoSection
                    key={complemento.id}
                    complemento={complemento}
                    selecoes={selecoesComplementos[complemento.id] || {}}
                    getQuantidade={(adicionalId) => getQuantidadeAdicional(complemento.id, adicionalId)}
                    quantidadeItem={quantity}
                    onToggle={(adicionalId) => toggleAdicional(complemento.id, adicionalId, complemento.permite_multipla_escolha, complemento.quantitativo)}
                    onIncrement={(adicionalId) => incrementarAdicional(complemento.id, adicionalId, complemento.quantitativo)}
                    onDecrement={(adicionalId) => decrementarAdicional(complemento.id, adicionalId)}
                    highlight={highlightedSections.includes(complemento.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                <Label className="text-base font-semibold">Complementos</Label>
                <p className="text-sm text-muted-foreground">Este combo não possui complementos disponíveis.</p>
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
                  placeholder="Ex: sem cebola, ponto médio, embalagem separada..."
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
                type="submit" 
                disabled={isLoadingComplementos || !estaAberta}
                className={`w-full h-14 text-base font-semibold shadow-lg transition-all ${
                  estaAberta && !isLoadingComplementos
                    ? "bg-primary hover:bg-primary/90 text-background hover:shadow-xl"
                    : "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                }`}
                size="lg"
                onClick={(e) => {
                  if (!estaAberta) {
                    e.preventDefault();
                    toast.error("A loja está fechada no momento. Não é possível adicionar itens ao carrinho.");
                    return;
                  }
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

