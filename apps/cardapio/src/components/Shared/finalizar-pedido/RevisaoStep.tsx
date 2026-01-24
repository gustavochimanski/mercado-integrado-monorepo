"use client";

import React, { useEffect, useState, useCallback } from "react";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/product/SheetAddProduto";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { useCart } from "@cardapio/stores/cart/useCart";
import type { CartItemComplemento } from "@cardapio/stores/cart/useCart";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@cardapio/components/Shared/ui/card";
import { Button } from "@cardapio/components/Shared/ui/button";
import {
  ChevronDown,
  Trash2,
  MapPin,
  CreditCard,
  FileText,
  Package,
  ShoppingBag,
  Users,
  Store,
  Minus,
  Plus,
  Pencil,
} from "lucide-react";

interface Item {
  cod_barras: string;
  nome: string;
  quantity: number;
  preco: number;
  empresaId?: number;
  imagem?: string | null;
  categoriaId?: number;
  subcategoriaId?: number;
  observacao?: string;
  complementos?: Array<{
    complemento_id: number;
    complemento_nome?: string;
    adicionais: Array<{
      adicional_id: number;
      quantidade: number;
      adicional_nome?: string;
      adicional_preco?: number;
    }>;
  }>;
  adicionais?: Array<{ id: number; nome: string; preco: number }>; // LEGADO
}

interface Combo {
  combo_id: number;
  nome?: string;
  quantidade: number;
  preco: number;
  observacao?: string;
  complementos?: Array<{
    complemento_id: number;
    complemento_nome?: string;
    adicionais: Array<{
      adicional_id: number;
      quantidade: number;
      adicional_nome?: string;
      adicional_preco?: number;
    }>;
  }>;
  adicionais?: Array<{ id: number; nome: string; preco: number }>; // LEGADO
}

interface Receita {
  receita_id: number;
  nome?: string;
  quantidade: number;
  preco: number;
  observacao?: string;
  complementos?: Array<{
    complemento_id: number;
    complemento_nome?: string;
    adicionais: Array<{
      adicional_id: number;
      quantidade: number;
      adicional_nome?: string;
      adicional_preco?: number;
    }>;
  }>;
  adicionais?: Array<{ id: number; nome: string; preco: number }>; // LEGADO
}

interface PreviewCheckoutData {
  valor_total: number;
}

interface RevisaoStepProps {
  items: Item[];
  combos?: Combo[];
  receitas?: Receita[];
  observacao?: string;
  endereco?: {
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
  };
  pagamento?: {
    nome?: string;
    tipo?: string;
  };
  trocoPara?: number | null;
  total: number;
  previewData?: PreviewCheckoutData | null;
  isLoadingPreview?: boolean;
  previewError?: Error | null;
  inc?: (cod_barras: string) => void;
  dec?: (cod_barras: string) => void;
  remove?: (cod_barras: string) => void;
  incCombo?: (combo_id: number) => void;
  decCombo?: (combo_id: number) => void;
  removeCombo?: (combo_id: number) => void;
  incReceita?: (receita_id: number) => void;
  decReceita?: (receita_id: number) => void;
  removeReceita?: (receita_id: number) => void;
  tipoPedido?: "DELIVERY" | "MESA" | "BALCAO" | null;
  mesaCodigo?: string | null;
  numPessoas?: number | null;
}

export default function RevisaoStep({
  items,
  combos = [],
  receitas = [],
  observacao,
  endereco,
  pagamento,
  trocoPara,
  total,
  previewData,
  isLoadingPreview = false,
  previewError,
  inc,
  dec,
  remove,
  incCombo,
  decCombo,
  removeCombo,
  incReceita,
  decReceita,
  removeReceita,
  tipoPedido,
  mesaCodigo,
  numPessoas,
}: RevisaoStepProps) {
  // Estado para controlar a seta
  const [showArrow, setShowArrow] = useState(true);
  
  // Estado para edição de item
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [sheetEditOpen, setSheetEditOpen] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    // Desaparece após 6 segundos
    const timer = setTimeout(() => setShowArrow(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Função para reconstruir ProdutoEmpMini a partir do CartItem
  const cartItemToProdutoEmpMini = useCallback((item: Item): ProdutoEmpMini | null => {
    if (!item.cod_barras) return null;
    
    return {
      cod_barras: item.cod_barras,
      preco_venda: item.preco,
      empresa_id: item.empresaId ?? 0,
      produto: {
        descricao: item.nome,
        imagem: item.imagem ?? null,
        cod_categoria: item.categoriaId ?? null,
      },
      subcategoria_id: item.subcategoriaId ?? 0,
    };
  }, []);

  // Função para converter complementos do CartItem para formato do Sheet
  const convertComplementosToSheet = useCallback((item: Item): CartItemComplemento[] | undefined => {
    if (!item.complementos || item.complementos.length === 0) {
      return undefined;
    }
    return item.complementos;
  }, []);

  // Handler para editar item
  const handleEditItem = useCallback((item: Item) => {
    setEditingItem(item);
    setSheetEditOpen(true);
  }, []);

  // Handler para salvar edição
  const handleSaveEdit = useCallback((
    produto: ProdutoEmpMini,
    quantity: number,
    observacao?: string,
    complementos?: CartItemComplemento[]
  ) => {
    if (!editingItem || !remove) return;
    
    // Remover item antigo
    remove(editingItem.cod_barras);
    
    // Adicionar item editado
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
    
    setSheetEditOpen(false);
    setEditingItem(null);
  }, [editingItem, remove, add]);

  return (
    <div className="space-y-3 relative pb-4">
      {/* Header Minimalista */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Revisão do Pedido</h2>
        <p className="text-sm text-muted-foreground mt-1">Confira os detalhes antes de finalizar</p>
      </div>

      {/* Tipo de Pedido - Design Minimalista */}
      {tipoPedido === "MESA" && mesaCodigo && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base">Mesa {mesaCodigo}</span>
                </div>
                {numPessoas && (
                  <p className="text-sm text-muted-foreground">
                    {numPessoas} {numPessoas === 1 ? "pessoa" : "pessoas"}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Atendimento na mesa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {tipoPedido === "BALCAO" && (
        <Card className="border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Store className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="font-semibold text-base block">Retirada no Balcão</span>
                <p className="text-xs text-muted-foreground">
                  Você receberá uma notificação quando estiver pronto
                </p>
                {mesaCodigo && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Código: <span className="font-medium">{mesaCodigo}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Endereço - Design Minimalista */}
      {tipoPedido === "DELIVERY" && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Endereço de entrega</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {endereco
                    ? `${endereco.logradouro || ""}${
                        endereco.numero ? `, ${endereco.numero}` : ""
                      }${endereco.bairro ? ` - ${endereco.bairro}` : ""}${
                        endereco.cidade ? `, ${endereco.cidade}` : ""
                      }`
                    : "Não informado"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagamento - Design Minimalista */}
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{pagamento?.nome || "Não informado"}</p>
              {pagamento?.tipo === "DINHEIRO" && trocoPara && (
                <p className="text-xs text-muted-foreground">
                  Troco para <span className="font-medium text-foreground">R$ {trocoPara.toFixed(2)}</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observação - Design Minimalista */}
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Observação</p>
              <p className="text-sm text-muted-foreground">
                {observacao?.trim() || "Nenhuma observação"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itens do pedido - Design Melhorado */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Itens do Pedido</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {/* Produtos */}
            {items.map((item) => {
              // NOVO: Calcular preço dos complementos
              const precoComplementos = (item.complementos || []).reduce((sum, comp) => {
                const precoComp = comp.adicionais.reduce((s, a) => {
                  const precoAdicional = a.adicional_preco || 0;
                  return s + (precoAdicional * a.quantidade);
                }, 0);
                return sum + precoComp;
              }, 0) * item.quantity;
              // LEGADO: Suporte para adicionais antigos
              const precoAdicionaisLegado = (item.adicionais || []).reduce((sum, adic) => sum + adic.preco, 0) * item.quantity;
              const precoTotal = (item.preco * item.quantity) + precoComplementos + precoAdicionaisLegado;
              
              return (
                <div
                  key={`produto-${item.cod_barras}`}
                  className="px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {item.quantity}x
                        </span>
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {item.nome}
                        </h3>
                      </div>
                      {item.observacao && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          Obs: {item.observacao}
                        </p>
                      )}
                      {/* NOVO: Exibir complementos */}
                      {item.complementos && item.complementos.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {item.complementos.map((complemento, compIdx) => (
                            <div key={compIdx} className="pl-2 border-l-2 border-muted">
                              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                                {complemento.complemento_nome || `Complemento #${complemento.complemento_id}`}:
                              </p>
                              {complemento.adicionais.map((adicional, adicIdx) => (
                                <p key={adicIdx} className="text-xs text-muted-foreground pl-2">
                                  + {adicional.adicional_nome || `Adicional #${adicional.adicional_id}`}
                                  {adicional.quantidade > 1 && ` (${adicional.quantidade}x)`}
                                  {adicional.adicional_preco && adicional.adicional_preco > 0 && (
                                    <span> - R$ {(adicional.adicional_preco * adicional.quantidade).toFixed(2)}</span>
                                  )}
                                </p>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* LEGADO: Suporte para adicionais antigos */}
                      {!item.complementos && item.adicionais && item.adicionais.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {item.adicionais.map((adicional, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">
                              + {adicional.nome} {adicional.preco > 0 && `(R$ ${adicional.preco.toFixed(2)})`}
                            </p>
                          ))}
                        </div>
                      )}
                      <p className="text-base font-semibold text-foreground mt-2">
                        R$ {precoTotal.toFixed(2)}
                      </p>
                    </div>
                    
                    {inc && dec && remove && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 text-primary border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                          onClick={() => handleEditItem(item)}
                          title="Editar item"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <div className="flex items-center gap-0.5 border rounded-md">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 rounded-r-none"
                            onClick={() => dec(item.cod_barras)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="min-w-[1.5rem] text-center text-xs font-medium px-1">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 rounded-l-none"
                            onClick={() => inc(item.cod_barras)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => remove(item.cod_barras)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Combos */}
            {combos.map((combo) => {
              // NOVO: Calcular preço dos complementos
              const precoComplementos = (combo.complementos || []).reduce((sum, comp) => {
                const precoComp = comp.adicionais.reduce((s, a) => {
                  const precoAdicional = a.adicional_preco || 0;
                  return s + (precoAdicional * a.quantidade);
                }, 0);
                return sum + precoComp;
              }, 0) * combo.quantidade;
              // LEGADO: Suporte para adicionais antigos
              const precoAdicionaisLegado = (combo.adicionais || []).reduce((sum, adic) => sum + adic.preco, 0) * combo.quantidade;
              const precoTotal = (combo.preco * combo.quantidade) + precoComplementos + precoAdicionaisLegado;
              
              return (
                <div
                  key={`combo-${combo.combo_id}`}
                  className="px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {combo.quantidade}x
                        </span>
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {combo.nome || `Combo #${combo.combo_id}`}
                        </h3>
                        <span className="text-xs text-muted-foreground bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                          Combo
                        </span>
                      </div>
                      {combo.observacao && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          Obs: {combo.observacao}
                        </p>
                      )}
                      {/* NOVO: Exibir complementos */}
                      {combo.complementos && combo.complementos.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {combo.complementos.map((complemento, compIdx) => (
                            <div key={compIdx} className="pl-2 border-l-2 border-muted">
                              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                                {complemento.complemento_nome || `Complemento #${complemento.complemento_id}`}:
                              </p>
                              {complemento.adicionais.map((adicional, adicIdx) => (
                                <p key={adicIdx} className="text-xs text-muted-foreground pl-2">
                                  + {adicional.adicional_nome || `Adicional #${adicional.adicional_id}`}
                                  {adicional.quantidade > 1 && ` (${adicional.quantidade}x)`}
                                  {adicional.adicional_preco && adicional.adicional_preco > 0 && (
                                    <span> - R$ {(adicional.adicional_preco * adicional.quantidade).toFixed(2)}</span>
                                  )}
                                </p>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* LEGADO: Suporte para adicionais antigos */}
                      {!combo.complementos && combo.adicionais && combo.adicionais.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {combo.adicionais.map((adicional, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">
                              + {adicional.nome} {adicional.preco > 0 && `(R$ ${adicional.preco.toFixed(2)})`}
                            </p>
                          ))}
                        </div>
                      )}
                      <p className="text-base font-semibold text-foreground mt-2">
                        R$ {precoTotal.toFixed(2)}
                      </p>
                    </div>
                    
                    {incCombo && decCombo && removeCombo && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="flex items-center gap-0.5 border rounded-md">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 rounded-r-none"
                            onClick={() => decCombo(combo.combo_id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="min-w-[1.5rem] text-center text-xs font-medium px-1">
                            {combo.quantidade}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 rounded-l-none"
                            onClick={() => incCombo(combo.combo_id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeCombo(combo.combo_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Receitas */}
            {receitas.map((receita) => {
              // NOVO: Calcular preço dos complementos
              const precoComplementos = (receita.complementos || []).reduce((sum, comp) => {
                const precoComp = comp.adicionais.reduce((s, a) => {
                  const precoAdicional = a.adicional_preco || 0;
                  return s + (precoAdicional * a.quantidade);
                }, 0);
                return sum + precoComp;
              }, 0) * receita.quantidade;
              // LEGADO: Suporte para adicionais antigos
              const precoAdicionaisLegado = (receita.adicionais || []).reduce((sum, adic) => sum + adic.preco, 0) * receita.quantidade;
              const precoTotal = (receita.preco * receita.quantidade) + precoComplementos + precoAdicionaisLegado;
              
              return (
                <div
                  key={`receita-${receita.receita_id}`}
                  className="px-6 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                          {receita.quantidade}x
                        </span>
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {receita.nome || `Receita #${receita.receita_id}`}
                        </h3>
                      </div>
                      {receita.observacao && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          Obs: {receita.observacao}
                        </p>
                      )}
                      {/* NOVO: Exibir complementos */}
                      {receita.complementos && receita.complementos.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {receita.complementos.map((complemento, compIdx) => (
                            <div key={compIdx} className="pl-2 border-l-2 border-muted">
                              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                                {complemento.complemento_nome || `Complemento #${complemento.complemento_id}`}:
                              </p>
                              {complemento.adicionais.map((adicional, adicIdx) => (
                                <p key={adicIdx} className="text-xs text-muted-foreground pl-2">
                                  + {adicional.adicional_nome || `Adicional #${adicional.adicional_id}`}
                                  {adicional.quantidade > 1 && ` (${adicional.quantidade}x)`}
                                  {adicional.adicional_preco && adicional.adicional_preco > 0 && (
                                    <span> - R$ {(adicional.adicional_preco * adicional.quantidade).toFixed(2)}</span>
                                  )}
                                </p>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                      {/* LEGADO: Suporte para adicionais antigos */}
                      {!receita.complementos && receita.adicionais && receita.adicionais.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {receita.adicionais.map((adicional, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">
                              + {adicional.nome} {adicional.preco > 0 && `(R$ ${adicional.preco.toFixed(2)})`}
                            </p>
                          ))}
                        </div>
                      )}
                      <p className="text-base font-semibold text-foreground mt-2">
                        R$ {precoTotal.toFixed(2)}
                      </p>
                    </div>
                    
                    {incReceita && decReceita && removeReceita && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="flex items-center gap-0.5 border rounded-md">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 rounded-r-none"
                            onClick={() => decReceita(receita.receita_id)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="min-w-[1.5rem] text-center text-xs font-medium px-1">
                            {receita.quantidade}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 rounded-l-none"
                            onClick={() => incReceita(receita.receita_id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeReceita(receita.receita_id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro - Design Premium */}
      <Card className="bg-gradient-to-br from-background to-muted/20 border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Resumo do Pedido</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoadingPreview ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-muted-foreground">Calculando valores...</span>
                <span className="text-xs text-muted-foreground">Aguarde enquanto calculamos os totais do pedido</span>
              </div>
            </div>
          ) : previewError ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="rounded-lg bg-destructive/10 border-2 border-destructive p-4 w-full">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-semibold text-destructive">
                      Não é possível fazer a entrega
                    </h4>
                    <p className="text-sm text-destructive/90">
                      {previewError.message || "O endereço informado está fora da área de entrega."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : previewData ? (
            <>
              {pagamento?.tipo === "DINHEIRO" && trocoPara && trocoPara > 0 && (
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                  <span>Troco para</span>
                  <span>R$ {trocoPara.toFixed(2)}</span>
                </div>
              )}
              
              <div className="pt-4 mt-4 border-t-2 border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {previewData.valor_total.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Taxa de entrega</span>
                <span>Será calculada</span>
              </div>
              <div className="pt-4 mt-4 border-t-2 border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Seta Flutuante - Melhorada */}
      {showArrow && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-primary/10 backdrop-blur-sm rounded-full p-2 animate-bounce">
            <ChevronDown className="h-5 w-5 text-primary" />
          </div>
        </div>
      )}

      {/* Sheet de Edição */}
      {editingItem && (
        <SheetAdicionarProduto
          produto={cartItemToProdutoEmpMini(editingItem)!}
          isOpen={sheetEditOpen}
          onClose={() => {
            setSheetEditOpen(false);
            setEditingItem(null);
          }}
          onAdd={handleSaveEdit}
          initialQuantity={editingItem.quantity}
          initialObservacao={editingItem.observacao}
          initialComplementos={convertComplementosToSheet(editingItem)}
        />
      )}
    </div>
  );
}
