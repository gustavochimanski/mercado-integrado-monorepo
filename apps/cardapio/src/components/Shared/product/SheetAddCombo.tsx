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
import { useAdicionaisCombo } from "@cardapio/services/adicionais";
import { useState, useMemo } from "react";
import type { AdicionalResponse } from "@cardapio/api";
import { useCart } from "@cardapio/stores/cart/useCart";
import type { CartItemAdicional } from "@cardapio/stores/cart/useCart";

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
  onAdd?: (combo: ComboMiniDTO, quantity: number, observacao?: string, adicionais_ids?: number[]) => void;
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
  
  // Buscar adicionais do combo usando o novo endpoint do catalogo
  const { data: adicionaisDaAPI = [], isLoading: isLoadingAdicionais } = useAdicionaisCombo(
    combo.id, // ID do combo
    true, // apenas ativos
    isOpen // só busca quando o sheet está aberto
  );

  const adicionais: AdicionalResponse[] = adicionaisDaAPI;

  // Estado para adicionais selecionados: mapeia ID do adicional para quantidade
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<Record<number, number>>({});

  // Resetar seleção quando o sheet fecha
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setAdicionaisSelecionados({});
      reset();
      onClose();
    }
  };

  // Agrupar adicionais por tipo (obrigatório vs opcional)
  const adicionaisAgrupados = useMemo(() => {
    const obrigatorios = adicionais.filter(a => a.obrigatorio);
    const opcionais = adicionais.filter(a => !a.obrigatorio);
    return { obrigatorios, opcionais };
  }, [adicionais]);

  // Obter quantidade de um adicional
  const getQuantidadeAdicional = (adicionalId: number) => {
    return adicionaisSelecionados[adicionalId] || 0;
  };

  // Incrementar quantidade de um adicional
  const incrementarAdicional = (adicionalId: number) => {
    setAdicionaisSelecionados(prev => ({
      ...prev,
      [adicionalId]: (prev[adicionalId] || 0) + 1,
    }));
  };

  // Decrementar quantidade de um adicional
  const decrementarAdicional = (adicionalId: number) => {
    setAdicionaisSelecionados(prev => {
      const quantidadeAtual = prev[adicionalId] || 0;
      if (quantidadeAtual <= 1) {
        const novo = { ...prev };
        delete novo[adicionalId];
        return novo;
      }
      return {
        ...prev,
        [adicionalId]: quantidadeAtual - 1,
      };
    });
  };

  // Toggle adicional (para adicionais que não permitem múltipla escolha)
  const toggleAdicional = (adicionalId: number, permiteMultipla: boolean) => {
    if (permiteMultipla) {
      incrementarAdicional(adicionalId);
    } else {
      setAdicionaisSelecionados(prev => {
        if (prev[adicionalId]) {
          const novo = { ...prev };
          delete novo[adicionalId];
          return novo;
        }
        return {
          ...prev,
          [adicionalId]: 1,
        };
      });
    }
  };

  // Calcular preço total incluindo adicionais (considerando quantidades)
  const precoAdicionais = useMemo(() => {
    return Object.entries(adicionaisSelecionados).reduce((total, [adicionalId, quantidade]) => {
      const adicional = adicionais.find(a => a.id === Number(adicionalId));
      return total + (adicional?.preco || 0) * quantidade;
    }, 0);
  }, [adicionaisSelecionados, adicionais]);

  const precoTotal = (combo.preco_total + precoAdicionais) * quantity;

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

  function onSubmit(data: FormData) {
    const observacao = data.observacao?.trim() || undefined;
    
    // Converter o objeto de quantidades em array de IDs (com repetição baseada na quantidade)
    const adicionaisIds: number[] = [];
    Object.entries(adicionaisSelecionados).forEach(([adicionalId, quantidade]) => {
      for (let i = 0; i < quantidade; i++) {
        adicionaisIds.push(Number(adicionalId));
      }
    });

    // Buscar dados completos dos adicionais para exibição
    const adicionaisCompletos: CartItemAdicional[] = [];
    Object.entries(adicionaisSelecionados).forEach(([adicionalId, quantidade]) => {
      const adicional = adicionais.find(a => a.id === Number(adicionalId));
      if (adicional) {
        for (let i = 0; i < quantidade; i++) {
          adicionaisCompletos.push({
            id: adicional.id,
            nome: adicional.nome,
            preco: adicional.preco,
          });
        }
      }
    });

    if (onAdd) {
      onAdd(combo, data.quantity, observacao, adicionaisIds.length > 0 ? adicionaisIds : undefined);
    } else {
      // Adicionar diretamente ao carrinho
      addCombo({
        combo_id: combo.id,
        quantidade: data.quantity,
        preco: combo.preco_total,
        observacao,
        adicionais: adicionaisCompletos.length > 0 ? adicionaisCompletos : undefined,
      });
    }

    setValue("quantity", 1);
    setValue("observacao", "");
    setAdicionaisSelecionados({});
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
                  {precoAdicionais > 0 && (
                    <span className="text-xs text-muted-foreground mt-1">
                      + R$ {precoAdicionais.toFixed(2).replace(".", ",")} em adicionais
                    </span>
                  )}
                </div>
                {(quantity > 1 || precoAdicionais > 0) && (
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

            {/* Seção de Adicionais */}
            {isLoadingAdicionais ? (
              <div className="space-y-3 mb-6">
                <Label className="text-base font-semibold">Adicionais</Label>
                <p className="text-sm text-muted-foreground">Carregando adicionais...</p>
              </div>
            ) : adicionais.length > 0 ? (
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Adicionais</Label>
                  <span className="text-xs text-muted-foreground">
                    {Object.keys(adicionaisSelecionados).length > 0 && `+ R$ ${precoAdicionais.toFixed(2).replace(".", ",")}`}
                  </span>
                </div>

                {/* Adicionais Obrigatórios */}
                {adicionaisAgrupados.obrigatorios.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Obrigatórios</Label>
                    {adicionaisAgrupados.obrigatorios.map((adicional) => (
                      <AdicionalItem
                        key={adicional.id}
                        adicional={adicional}
                        quantidade={getQuantidadeAdicional(adicional.id)}
                        onToggle={() => toggleAdicional(adicional.id, adicional.permite_multipla_escolha)}
                        onIncrement={() => incrementarAdicional(adicional.id)}
                        onDecrement={() => decrementarAdicional(adicional.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Adicionais Opcionais */}
                {adicionaisAgrupados.opcionais.length > 0 && (
                  <div className="space-y-2">
                    {adicionaisAgrupados.obrigatorios.length > 0 && (
                      <Label className="text-sm font-medium text-muted-foreground">Opcionais</Label>
                    )}
                    {adicionaisAgrupados.opcionais.map((adicional) => (
                      <AdicionalItem
                        key={adicional.id}
                        adicional={adicional}
                        quantidade={getQuantidadeAdicional(adicional.id)}
                        onToggle={() => toggleAdicional(adicional.id, adicional.permite_multipla_escolha)}
                        onIncrement={() => incrementarAdicional(adicional.id)}
                        onDecrement={() => decrementarAdicional(adicional.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Divisor */}
            {adicionais.length > 0 && <div className="border-t border-border my-6" />}

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
              disabled={isLoadingAdicionais}
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

// Componente para exibir um adicional
function AdicionalItem({ 
  adicional, 
  quantidade,
  onToggle,
  onIncrement,
  onDecrement,
}: { 
  adicional: AdicionalResponse; 
  quantidade: number;
  onToggle: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const isSelected = quantidade > 0;
  const permiteMultipla = adicional.permite_multipla_escolha;

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
          <div className="flex items-center gap-2">
            <Label className={`text-sm font-medium ${!permiteMultipla ? "cursor-pointer" : ""}`}>
              {adicional.nome}
            </Label>
            {adicional.obrigatorio && (
              <Badge variant="destructive" className="text-xs px-1.5 py-0">
                Obrigatório
              </Badge>
            )}
          </div>
          {adicional.descricao && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {adicional.descricao}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {adicional.preco > 0 && (
          <span className="text-sm font-semibold text-primary">
            {quantidade > 0 && permiteMultipla ? (
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

