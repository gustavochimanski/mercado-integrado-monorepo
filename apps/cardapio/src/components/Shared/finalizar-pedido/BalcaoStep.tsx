"use client";

import { useState, useEffect, useMemo } from "react";
import { Store, Clock, CheckCircle2, AlertCircle, ShoppingBag, Building2 } from "lucide-react";
import { Card, CardContent } from "@cardapio/components/Shared/ui/card";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Label } from "@cardapio/components/Shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cardapio/components/Shared/ui/select";
import { cn } from "@cardapio/lib/utils";

interface BalcaoStepProps {
  mesaCodigo: string | null;
  onMesaCodigoChange: (mesaCodigo: string | null) => void;
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
  mesaCodigo,
  onMesaCodigoChange,
  empresas,
  empresaSelecionadaId,
  onEmpresaSelecionadaChange,
  isLoadingEmpresas = false,
  carregamentoFalhou = false,
}: BalcaoStepProps) {
  const [codigoLocal, setCodigoLocal] = useState<string>(mesaCodigo ?? "");

  useEffect(() => {
    if ((mesaCodigo ?? "") !== codigoLocal) {
      setCodigoLocal(mesaCodigo ?? "");
    }
  }, [mesaCodigo]);

  const handleChange = (value: string) => {
    const apenasNumeros = value.replace(/\D/g, "");
    setCodigoLocal(apenasNumeros);

    if (apenasNumeros) {
      onMesaCodigoChange(apenasNumeros);
    } else {
      onMesaCodigoChange(null);
    }
  };

  const opcoesEmpresas = useMemo<Array<EmpresaListaItem & { label: string; value: string }>>(
    () =>
      empresas.map((empresa: EmpresaListaItem) => ({
        ...empresa,
        label: empresa.nome,
        value: String(empresa.id),
      })),
    [empresas]
  );

  const descricaoEmpresaSelecionada = useMemo(() => {
    if (!empresaSelecionadaId) {
      return "Selecione a loja onde você está realizando a retirada.";
    }

    const empresa = empresas.find((item: EmpresaListaItem) => item.id === empresaSelecionadaId);
    if (!empresa) {
      return "Selecione a loja onde você está realizando a retirada.";
    }

    const distanciaInfo =
      typeof empresa.distancia_km === "number"
        ? `${empresa.distancia_km.toFixed(1)} km`
        : null;

    const localizacao = [empresa.bairro, empresa.cidade, empresa.estado]
      .filter(Boolean)
      .join(" • ");

    const descricao = [distanciaInfo, localizacao].filter(Boolean).join(" • ");
    return descricao || "Loja selecionada para retirada.";
  }, [empresaSelecionadaId, empresas]);

  const formatDescricaoEmpresa = (empresaId: number) => {
    const empresa = empresas.find((item: EmpresaListaItem) => item.id === empresaId);
    if (!empresa) {
      return null;
    }

    const distanciaInfo =
      typeof empresa.distancia_km === "number"
        ? `${empresa.distancia_km.toFixed(1)} km`
        : null;

    const localizacao = [empresa.bairro, empresa.cidade, empresa.estado]
      .filter(Boolean)
      .join(" • ");

    return [distanciaInfo, localizacao].filter(Boolean).join(" • ");
  };

  const handleEmpresaChange = (value: string) => {
    if (value === "empty") {
      onEmpresaSelecionadaChange(null);
      return;
    }

    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      onEmpresaSelecionadaChange(null);
    } else {
      onEmpresaSelecionadaChange(parsed);
    }
  };

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
                  <ShoppingBag className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <span>Você faz o pedido e escolhe a forma de pagamento</span>
                </li>
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
              <p className="text-base font-medium">Onde você está?</p>
              <p className="text-sm text-muted-foreground">
                Escolha a unidade em que você realizará a retirada do pedido.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Unidade</Label>

            <Select
              onValueChange={handleEmpresaChange}
              value={
                empresaSelecionadaId ? String(empresaSelecionadaId) : "empty"
              }
              disabled={isLoadingEmpresas || carregamentoFalhou || nenhumaEmpresaDisponivel}
            >
              <SelectTrigger className={cn("w-full justify-between", !empresaSelecionadaId && "text-muted-foreground")}>
                <SelectValue placeholder={
                  isLoadingEmpresas
                    ? "Carregando unidades..."
                    : carregamentoFalhou
                      ? "Não foi possível carregar as unidades"
                      : nenhumaEmpresaDisponivel
                        ? "Nenhuma unidade disponível no momento"
                        : "Selecione a unidade para retirada"
                } />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)] max-h-72">
                {empresas.length > 0 && (
                  <SelectItem value="empty">
                    <span className="text-sm text-muted-foreground">Limpar seleção</span>
                  </SelectItem>
                )}
                {opcoesEmpresas.map((empresa) => (
                  <SelectItem key={empresa.value} value={empresa.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{empresa.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDescricaoEmpresa(Number(empresa.value)) || "Endereço indisponível"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!isLoadingEmpresas && empresaSelecionadaId && (
              <p className="text-xs text-muted-foreground">{descricaoEmpresaSelecionada}</p>
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

      <div className="bg-muted/30 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground font-medium">
          Continue para escolher a forma de pagamento
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="codigo-balcao" className="text-base font-medium">
          Código ou número de referência (opcional)
        </Label>
        <Input
          id="codigo-balcao"
          type="text"
          inputMode="numeric"
          placeholder="Informe se desejar vincular a uma mesa"
          value={codigoLocal}
          onChange={(e) => handleChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Use este campo se o estabelecimento utilizar códigos para retirada.
        </p>
      </div>
    </div>
  );
}

