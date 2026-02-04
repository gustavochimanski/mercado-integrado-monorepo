"use client";

import { useMemo } from "react";
import { Store, Clock, CheckCircle2, AlertCircle, Building2 } from "lucide-react";
import { Card, CardContent } from "@cardapio/components/Shared/ui/card";
import { cn } from "@cardapio/lib/utils";

interface BalcaoStepProps {
  empresas: {
    id: number;
    nome: string;
    distancia_km?: number | null;
    bairro?: string | null;
    cidade?: string | null;
    estado?: string | null;
  }[];
  empresaSelecionadaId: number | null;
  onEmpresaSelecionadaChange: (empresaId: number | null) => void;
  isLoadingEmpresas?: boolean;
  carregamentoFalhou?: boolean;
}

type EmpresaListaItem = BalcaoStepProps["empresas"][number];

export default function BalcaoStep({
  empresas,
  empresaSelecionadaId,
  onEmpresaSelecionadaChange,
  isLoadingEmpresas = false,
  carregamentoFalhou = false,
}: BalcaoStepProps) {
  const formatDescricaoEmpresa = (empresa: EmpresaListaItem) => {
    if (!empresa) return null;

    const distanciaInfo =
      typeof empresa.distancia_km === "number"
        ? `${empresa.distancia_km.toFixed(1)} km`
        : null;

    const localizacao = [empresa.bairro, empresa.cidade, empresa.estado]
      .filter(Boolean)
      .join(" • ");

    return [distanciaInfo, localizacao].filter(Boolean).join(" • ");
  };

  const empresasOrdenadas = useMemo(() => {
    // Priorizar por distância quando disponível, senão mantém ordem original
    const hasAnyDistance = empresas.some((e) => typeof e.distancia_km === "number");
    if (!hasAnyDistance) return empresas;
    return [...empresas].sort((a, b) => {
      const da = typeof a.distancia_km === "number" ? a.distancia_km : Number.POSITIVE_INFINITY;
      const db = typeof b.distancia_km === "number" ? b.distancia_km : Number.POSITIVE_INFINITY;
      return da - db;
    });
  }, [empresas]);

  const nenhumaEmpresaDisponivel = !isLoadingEmpresas && empresas.length === 0;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Retirada no Balcão</h2>
        <p className="text-sm text-muted-foreground">
          Seu pedido estará pronto para retirada no balcão do estabelecimento
        </p>
      </div>

      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Store className="text-primary" size={48} />
            </div>
            
            <div className="w-full max-w-md">
              <h3 className="font-semibold text-lg mb-4">Como funciona?</h3>
              <ul className="text-sm text-muted-foreground space-y-3 text-left">
                <li className="flex items-start gap-3">
                  <Clock className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <span>O tempo de preparo será informado após a confirmação do pedido</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <span>Quando o pedido estiver pronto, você será notificado</span>
                </li>
                <li className="flex items-start gap-3">
                  <Store className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <span>Retire seu pedido no balcão do estabelecimento</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-dashed border-muted-foreground/40">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Building2 className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-base font-medium">Seleciona a sua loja</p>
              <p className="text-sm text-muted-foreground">
                Escolha a unidade em que você realizará a retirada do pedido.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {isLoadingEmpresas && (
              <div className="space-y-2">
                <div className="h-12 rounded-xl bg-muted animate-pulse" />
                <div className="h-12 rounded-xl bg-muted animate-pulse" />
                <div className="h-12 rounded-xl bg-muted animate-pulse" />
                <p className="text-xs text-muted-foreground">Carregando unidades...</p>
              </div>
            )}

            {carregamentoFalhou && (
              <p className="text-xs text-destructive">
                Não foi possível carregar as unidades. Atualize a página ou tente novamente mais tarde.
              </p>
            )}

            {nenhumaEmpresaDisponivel && (
              <p className="text-xs text-muted-foreground">
                No momento não há unidades disponíveis para retirada. Volte mais tarde ou escolha outro tipo de atendimento.
              </p>
            )}

            {!isLoadingEmpresas && !carregamentoFalhou && !nenhumaEmpresaDisponivel && (
              <div className="grid gap-3">
                {empresasOrdenadas.map((empresa) => {
                  const isSelected = empresaSelecionadaId === empresa.id;
                  const descricao = formatDescricaoEmpresa(empresa) || "Endereço indisponível";

                  return (
                    <button
                      key={empresa.id}
                      type="button"
                      onClick={() => onEmpresaSelecionadaChange(empresa.id)}
                      className={cn(
                        "w-full text-left rounded-xl border p-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-muted-foreground/20 hover:border-primary/40"
                      )}
                      aria-pressed={isSelected}
                      aria-label={`Selecionar ${empresa.nome} como loja de retirada`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium truncate">{empresa.nome}</p>
                          <p className="text-xs text-muted-foreground mt-1">{descricao}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={20} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {!isLoadingEmpresas && !!empresaSelecionadaId && (
              <button
                type="button"
                onClick={() => onEmpresaSelecionadaChange(null)}
                className={cn(
                  "text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                )}
              >
                Limpar seleção
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Importante</p>
              <p className="text-sm text-blue-700">
                Certifique-se de estar presente no estabelecimento para retirar seu pedido quando estiver pronto.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

