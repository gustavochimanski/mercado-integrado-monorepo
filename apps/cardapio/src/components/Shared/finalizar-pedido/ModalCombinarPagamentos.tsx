"use client";

import { useState, useEffect } from "react";
import type { MeioPagamento } from "@cardapio/services/meio-pagamento";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@cardapio/components/Shared/ui/dialog";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Label } from "@cardapio/components/Shared/ui/label";
import { Input } from "@cardapio/components/Shared/ui/input";
import { X, Plus, Trash2, Check } from "lucide-react";
import { Banknote, CreditCard, QrCode, Smartphone, type LucideIcon } from "lucide-react";

const ICONES_PAGAMENTO: Record<string, LucideIcon> = {
  DINHEIRO: Banknote,
  CARTAO_ENTREGA: CreditCard,
  CARTAO_ONLINE: CreditCard,
  PIX_ENTREGA: QrCode,
  PIX_ONLINE: Smartphone,
};

export interface MeioPagamentoSelecionado {
  id: number;
  valor: number;
  nome: string;
  tipo: string;
}

interface ModalCombinarPagamentosProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (meios: MeioPagamentoSelecionado[], trocoPara?: number) => void;
  meiosDisponiveis: MeioPagamento[];
  valorTotal: number;
  meiosIniciais?: MeioPagamentoSelecionado[];
}

export default function ModalCombinarPagamentos({
  open,
  onClose,
  onConfirm,
  meiosDisponiveis,
  valorTotal,
  meiosIniciais = [],
}: ModalCombinarPagamentosProps) {
  const [meiosSelecionados, setMeiosSelecionados] = useState<MeioPagamentoSelecionado[]>(meiosIniciais);
  const [trocoPara, setTrocoPara] = useState<Record<number, string>>({});
  const [valorTexto, setValorTexto] = useState<Record<number, string>>({});

  const parseDecimalPtBr = (raw: string): number | null => {
    const trimmed = raw.trim();
    if (!trimmed) return null;

    // Mantém apenas dígitos e separadores comuns.
    let cleaned = trimmed.replace(/[^\d,.\-]/g, "");

    // Se tiver vírgula, assume vírgula como separador decimal e remove pontos (milhar).
    if (cleaned.includes(",")) {
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    }

    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  };

  const formatMoney2 = (n: number) => n.toFixed(2);

  useEffect(() => {
    if (open) {
      setMeiosSelecionados(meiosIniciais.length > 0 ? meiosIniciais : []);
      setTrocoPara({});
      setValorTexto(
        Object.fromEntries(
          (meiosIniciais.length > 0 ? meiosIniciais : []).map((m) => [m.id, formatMoney2(m.valor)])
        )
      );
    }
  }, [open, meiosIniciais]);

  const somaValores = meiosSelecionados.reduce((acc, m) => acc + m.valor, 0);
  const diferenca = Math.abs(somaValores - valorTotal);
  const valoresBatem = diferenca < 0.01; // Tolerância de 1 centavo
  const faltaValor = somaValores < valorTotal;
  const sobrouValor = somaValores > valorTotal;

  const adicionarMeio = (meio: MeioPagamento) => {
    const valorRestante = valorTotal - somaValores;
    const novoValor = valorRestante > 0 ? Math.max(0, valorRestante) : 0;

    setMeiosSelecionados([
      ...meiosSelecionados,
      {
        id: meio.id,
        valor: novoValor,
        nome: meio.nome,
        tipo: meio.tipo,
      },
    ]);

    setValorTexto((prev) => ({
      ...prev,
      [meio.id]: formatMoney2(novoValor),
    }));
  };

  const removerMeio = (index: number) => {
    const novosMeios = meiosSelecionados.filter((_, i) => i !== index);
    setMeiosSelecionados(novosMeios);
    
    // Limpar troco para se o meio removido era dinheiro
    const meioRemovido = meiosSelecionados[index];
    if (meioRemovido?.tipo === "DINHEIRO") {
      const novosTrocos = { ...trocoPara };
      delete novosTrocos[meioRemovido.id];
      setTrocoPara(novosTrocos);
    }

    if (meioRemovido) {
      setValorTexto((prev) => {
        const next = { ...prev };
        delete next[meioRemovido.id];
        return next;
      });
    }
  };

  const atualizarValor = (index: number, novoValor: number) => {
    const novosMeios = [...meiosSelecionados];
    novosMeios[index] = {
      ...novosMeios[index],
      valor: Math.max(0, novoValor),
    };
    setMeiosSelecionados(novosMeios);
  };

  const atualizarTrocoPara = (meioId: number, valor: string) => {
    setTrocoPara({
      ...trocoPara,
      [meioId]: valor,
    });
  };

  const distribuirRestante = () => {
    if (meiosSelecionados.length === 0) return;
    
    const valorRestante = valorTotal - somaValores;
    if (Math.abs(valorRestante) < 0.01) return;

    const novosMeios = [...meiosSelecionados];
    const primeiroMeio = novosMeios[0];
    novosMeios[0] = {
      ...primeiroMeio,
      valor: Math.max(0, primeiroMeio.valor + valorRestante),
    };
    setMeiosSelecionados(novosMeios);
  };

  const handleConfirmar = () => {
    if (!valoresBatem) {
      distribuirRestante();
      return;
    }

    // Calcular o maior troco para dinheiro (se houver)
    let maiorTroco: number | undefined = undefined;
    const meiosDinheiro = meiosSelecionados.filter(m => m.tipo === "DINHEIRO");
    if (meiosDinheiro.length > 0) {
      meiosDinheiro.forEach(meio => {
        const trocoValor = parseDecimalPtBr(trocoPara[meio.id] || "") ?? 0;
        if (!isNaN(trocoValor) && trocoValor > 0) {
          if (maiorTroco === undefined || trocoValor > maiorTroco) {
            maiorTroco = trocoValor;
          }
        }
      });
    }

    onConfirm(meiosSelecionados, maiorTroco);
    onClose();
  };

  const meiosDisponiveisParaAdicionar = meiosDisponiveis.filter(
    m => !meiosSelecionados.some(ms => ms.id === m.id)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Combinar Pagamentos</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo do total */}
          <div className="p-4 bg-muted/50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Total do pedido:</span>
              <span className="text-lg font-bold">R$ {valorTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Total selecionado:</span>
              <span className={`text-lg font-bold ${valoresBatem ? "text-green-600" : sobrouValor ? "text-red-600" : "text-orange-600"}`}>
                R$ {somaValores.toFixed(2)}
              </span>
            </div>
            {!valoresBatem && (
              <div className="mt-2 text-xs">
                {faltaValor ? (
                  <span className="text-orange-600">
                    Faltam R$ {diferenca.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-red-600">
                    Excedeu R$ {diferenca.toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Lista de meios selecionados */}
          <div className="space-y-3">
            {meiosSelecionados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum meio de pagamento selecionado</p>
                <p className="text-xs mt-1">Clique em "Adicionar meio" para começar</p>
              </div>
            ) : (
              meiosSelecionados.map((meio, index) => {
                const Icon = ICONES_PAGAMENTO[meio.tipo] || Banknote;
                const mostrarTroco = meio.tipo === "DINHEIRO";
                const trocoValor = trocoPara[meio.id] || "";

                return (
                  <div
                    key={`${meio.id}-${index}`}
                    className="p-4 border border-border rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="text-primary" size={20} />
                        <span className="font-medium">{meio.nome}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removerMeio(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`valor-${index}`} className="text-sm">
                        Valor <span className="text-red-600">*</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">R$</span>
                        <Input
                          id={`valor-${index}`}
                          type="text"
                          inputMode="decimal"
                          placeholder="0,00"
                          value={valorTexto[meio.id] ?? formatMoney2(meio.valor)}
                          onChange={(e) => {
                            const raw = e.target.value;
                            setValorTexto((prev) => ({ ...prev, [meio.id]: raw }));
                            const parsed = parseDecimalPtBr(raw);
                            if (parsed !== null) {
                              atualizarValor(index, parsed);
                            } else if (raw.trim() === "") {
                              atualizarValor(index, 0);
                            }
                          }}
                          onBlur={() => {
                            const parsed = parseDecimalPtBr(valorTexto[meio.id] ?? "");
                            setValorTexto((prev) => ({
                              ...prev,
                              [meio.id]: formatMoney2(parsed ?? meio.valor ?? 0),
                            }));
                            if (parsed !== null) {
                              atualizarValor(index, parsed);
                            }
                          }}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    {mostrarTroco && (
                      <div className="space-y-2">
                        <Label htmlFor={`troco-${index}`} className="text-sm">
                          Troco para quanto? <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">R$</span>
                          <Input
                            id={`troco-${index}`}
                            type="text"
                            inputMode="decimal"
                            placeholder={`Ex: ${(meio.valor + 10).toFixed(2)}`}
                            value={trocoValor}
                            onChange={(e) => atualizarTrocoPara(meio.id, e.target.value)}
                            onBlur={() => {
                              const parsed = parseDecimalPtBr(trocoPara[meio.id] || "");
                              if (parsed !== null) {
                                atualizarTrocoPara(meio.id, formatMoney2(parsed));
                              }
                            }}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Lista de meios disponíveis para adicionar */}
          {meiosDisponiveisParaAdicionar.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Escolha os meios de pagamento para combinar:</Label>
              <div className="grid gap-2">
                {meiosDisponiveisParaAdicionar.map((meio) => {
                  const Icon = ICONES_PAGAMENTO[meio.tipo] || Banknote;
                  return (
                    <button
                      key={meio.id}
                      type="button"
                      onClick={() => adicionarMeio(meio)}
                      className="flex items-center gap-3 p-3 border-2 border-dashed border-muted-foreground/30 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <Icon className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
                      <span className="flex-1 font-medium">{meio.nome}</span>
                      <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs">Adicionar</span>
                        <Plus size={16} />
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Clique em um meio de pagamento para adicioná-lo à combinação
              </p>
            </div>
          )}

          {meiosDisponiveisParaAdicionar.length === 0 && meiosSelecionados.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum meio de pagamento disponível</p>
            </div>
          )}

          {meiosDisponiveisParaAdicionar.length === 0 && meiosSelecionados.length > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Todos os meios de pagamento disponíveis já foram adicionados
              </p>
            </div>
          )}

          {/* Aviso se valores não batem */}
          {!valoresBatem && meiosSelecionados.length > 0 && (
            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                {faltaValor
                  ? `A soma dos valores está R$ ${diferenca.toFixed(2)} abaixo do total. Clique em "Confirmar" para ajustar automaticamente.`
                  : `A soma dos valores está R$ ${diferenca.toFixed(2)} acima do total. Ajuste os valores antes de confirmar.`}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={meiosSelecionados.length === 0 || (sobrouValor && !valoresBatem)}
            className="w-full sm:w-auto"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
