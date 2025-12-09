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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "../ui/badge";
import { ComboMiniDTO } from "@cardapio/services/home";
import { ImageZoomDialog } from "../ui/image-zoom-dialog";
import Image from "next/image";
import { Minus, Plus, ShoppingCart, X, Check } from "lucide-react";
import { useComplementosCombo } from "@cardapio/services/complementos";
import { useState, useMemo } from "react";
import type { ComplementoResponse, AdicionalComplemento } from "@cardapio/services/complementos/buscar-complementos-produto-client";
import { useCart } from "@cardapio/stores/cart/useCart";
import type { CartItemComplemento } from "@cardapio/stores/cart/useCart";

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
  onAdd?: (combo: ComboMiniDTO, quantity: number, observacao?: string, complementos?: CartItemComplemento[]) => void;
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
  
  // Buscar complementos do combo usando o novo endpoint
  const { data: complementosDaAPI = [], isLoading: isLoadingComplementos } = useComplementosCombo(
    combo.id, // ID do combo
    true, // apenas ativos
    isOpen // só busca quando o sheet está aberto
  );

  const complementos: ComplementoResponse[] = complementosDaAPI;

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
      const complementoSelecoes = prev[complementoId] || {};
      const quantidadeAtual = complementoSelecoes[adicionalId] || 0;
      
      // Se não é quantitativo, sempre será 1
      const novaQuantidade = quantitativo ? quantidadeAtual + 1 : 1;
      
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
            [adicionalId]: quantitativo ? 1 : 1,
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

  const precoTotal = (combo.preco_total + precoComplementos) * quantity;

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

  // Validar se complementos obrigatórios foram selecionados
  const validarComplementos = (): boolean => {
    for (const complemento of complementos) {
      if (complemento.obrigatorio) {
        const selecoes = selecoesComplementos[complemento.id];
        if (!selecoes || Object.keys(selecoes).length === 0) {
          return false;
        }
      }
    }
    return true;
  };

  function onSubmit(data: FormData) {
    const observacao = data.observacao?.trim() || undefined;
    
    // Validar complementos obrigatórios
    if (!validarComplementos()) {
      // TODO: Mostrar erro ao usuário
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
      onAdd(combo, data.quantity, observacao, complementosSelecionados.length > 0 ? complementosSelecionados : undefined);
    } else {
      // Adicionar diretamente ao carrinho
      addCombo({
        combo_id: combo.id,
        nome: combo.titulo,
        quantidade: data.quantity,
        preco: combo.preco_total,
        observacao,
        complementos: complementosSelecionados.length > 0 ? complementosSelecionados : undefined,
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
        className="min-h-[55vh] max-h-[85vh] overflow-y-auto w-full max-w-full rounded-t-3xl rounded-b-none p-0 bg-background"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          {/* Botão de fechar customizado */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2 text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

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

          {/* Conteúdo Scrollável */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
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
            ) : complementos.length > 0 ? (
              <div className="space-y-6 mb-6">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Complementos</Label>
                  <span className="text-xs text-muted-foreground">
                    {Object.keys(selecoesComplementos).length > 0 && `+ R$ ${precoComplementos.toFixed(2).replace(".", ",")}`}
                  </span>
                </div>

                {complementos.map((complemento) => (
                  <ComplementoSection
                    key={complemento.id}
                    complemento={complemento}
                    selecoes={selecoesComplementos[complemento.id] || {}}
                    getQuantidade={(adicionalId) => getQuantidadeAdicional(complemento.id, adicionalId)}
                    onToggle={(adicionalId) => toggleAdicional(complemento.id, adicionalId, complemento.permite_multipla_escolha, complemento.quantitativo)}
                    onIncrement={(adicionalId) => incrementarAdicional(complemento.id, adicionalId, complemento.quantitativo)}
                    onDecrement={(adicionalId) => decrementarAdicional(complemento.id, adicionalId)}
                  />
                ))}
              </div>
            ) : null}

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
          </div>

          {/* Footer Fixo */}
          <SheetFooter className="border-t border-border bg-background px-4 pt-4 pb-6 sticky bottom-0">
            <Button 
              type="submit" 
              disabled={isLoadingComplementos}
              className="w-full h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90 text-background disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {`Adicionar ao Carrinho • R$ ${precoTotal.toFixed(2).replace(".", ",")}`}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// Componente para exibir uma seção de complemento
function ComplementoSection({
  complemento,
  selecoes,
  getQuantidade,
  onToggle,
  onIncrement,
  onDecrement,
}: {
  complemento: ComplementoResponse;
  selecoes: Record<number, number>;
  getQuantidade: (adicionalId: number) => number;
  onToggle: (adicionalId: number) => void;
  onIncrement: (adicionalId: number) => void;
  onDecrement: (adicionalId: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-base font-semibold">{complemento.nome}</Label>
        {complemento.obrigatorio && (
          <Badge variant="destructive" className="text-xs px-1.5 py-0">
            Obrigatório
          </Badge>
        )}
        {complemento.quantitativo && (
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            Quantitativo
          </Badge>
        )}
        {!complemento.permite_multipla_escolha && (
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            Escolha única
          </Badge>
        )}
      </div>
      {complemento.descricao && (
        <p className="text-sm text-muted-foreground">{complemento.descricao}</p>
      )}
      <div className="space-y-2 pl-2 border-l-2 border-border">
        {complemento.adicionais.map((adicional) => (
          <AdicionalItem
            key={adicional.id}
            adicional={adicional}
            quantidade={getQuantidade(adicional.id)}
            permiteMultipla={complemento.permite_multipla_escolha}
            quantitativo={complemento.quantitativo}
            onToggle={() => onToggle(adicional.id)}
            onIncrement={() => onIncrement(adicional.id)}
            onDecrement={() => onDecrement(adicional.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Componente para exibir um adicional dentro de um complemento
function AdicionalItem({
  adicional,
  quantidade,
  permiteMultipla,
  quantitativo,
  onToggle,
  onIncrement,
  onDecrement,
}: {
  adicional: AdicionalComplemento;
  quantidade: number;
  permiteMultipla: boolean;
  quantitativo: boolean;
  onToggle: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const isSelected = quantidade > 0;

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 bg-background"
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        {!permiteMultipla ? (
          <div
            className={`flex items-center justify-center w-5 h-5 rounded border-2 cursor-pointer ${
              isSelected ? "border-primary bg-primary" : "border-muted-foreground"
            }`}
            onClick={onToggle}
          >
            {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onDecrement();
              }}
              disabled={quantidade === 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-semibold w-6 text-center">{quantidade}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onIncrement();
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
        <div className="flex-1" onClick={!permiteMultipla ? onToggle : undefined}>
          <Label className={`text-sm font-medium ${!permiteMultipla ? "cursor-pointer" : ""}`}>
            {adicional.nome}
          </Label>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {adicional.preco > 0 && (
          <span className="text-sm font-semibold text-primary">
            {quantidade > 0 && quantitativo ? (
              <>
                R$ {(adicional.preco * quantidade).toFixed(2).replace(".", ",")}
                <span className="text-xs text-muted-foreground ml-1">
                  ({quantidade}x R$ {adicional.preco.toFixed(2).replace(".", ",")})
                </span>
              </>
            ) : (
              <>+ R$ {adicional.preco.toFixed(2).replace(".", ",")}</>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

