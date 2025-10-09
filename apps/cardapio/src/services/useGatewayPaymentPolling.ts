import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PagamentoStatusEnum } from "@cardapio/api/models/PagamentoStatusEnum";
import type { TransacaoOut } from "@cardapio/api/models/TransacaoOut";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";

export interface GatewayPollingOptions {
  pedidoId: number | null;
  transacao?: TransacaoOut | null;
  ativo: boolean;
  intervaloMs?: number;
}

interface PollingState {
  status: PagamentoStatusEnum | null;
  transacao: TransacaoOut | null;
  carregando: boolean;
  erro: string | null;
  ultimaAtualizacao: Date | null;
}

const STATUS_FINAIS = new Set<PagamentoStatusEnum>([
  PagamentoStatusEnum.PAGO,
  PagamentoStatusEnum.AUTORIZADO,
  PagamentoStatusEnum.CANCELADO,
  PagamentoStatusEnum.ESTORNADO,
  PagamentoStatusEnum.RECUSADO,
]);

export function useGatewayPaymentPolling({
  pedidoId,
  transacao,
  ativo,
  intervaloMs = 4000,
}: GatewayPollingOptions) {
  const [state, setState] = useState<PollingState>({
    status: transacao?.status ?? null,
    transacao: transacao ?? null,
    carregando: false,
    erro: null,
    ultimaAtualizacao: transacao?.updated_at ? new Date(transacao.updated_at) : null,
  });

  const timerId = useRef<NodeJS.Timeout | null>(null);

  const limparTimer = useCallback(() => {
    if (timerId.current) {
      clearTimeout(timerId.current);
      timerId.current = null;
    }
  }, []);

  const consultar = useCallback(async () => {
    if (!pedidoId || !transacao?.provider_transaction_id) return;

    setState((prev) => ({ ...prev, carregando: true, erro: null }));

    try {
      const { data } = await apiClienteAdmin.get(
        `/api/delivery/cliente/pedidos/${pedidoId}/pagamentos/${transacao.provider_transaction_id}`
      );

      const novoStatus = data.status as PagamentoStatusEnum;

      setState({
        status: novoStatus,
        transacao: {
          ...transacao,
          status: novoStatus,
          qr_code: data.qr_code ?? transacao.qr_code,
          qr_code_base64: data.qr_code_base64 ?? transacao.qr_code_base64,
          provider_transaction_id: data.provider_transaction_id ?? transacao.provider_transaction_id,
          payload_retorno: data.payload ?? transacao.payload_retorno,
          updated_at: new Date().toISOString(),
        },
        carregando: false,
        erro: null,
        ultimaAtualizacao: new Date(),
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        carregando: false,
        erro: extractErrorMessage(error, "Não foi possível consultar o pagamento"),
      }));
    }
  }, [pedidoId, transacao]);

  const isPolling = useMemo(() => {
    if (!ativo || !transacao?.status) {
      return false;
    }

    return !STATUS_FINAIS.has(transacao.status);
  }, [ativo, transacao]);

  useEffect(() => {
    setState({
      status: transacao?.status ?? null,
      transacao: transacao ?? null,
      carregando: false,
      erro: null,
      ultimaAtualizacao: transacao?.updated_at ? new Date(transacao.updated_at) : null,
    });
  }, [transacao]);

  useEffect(() => {
    if (!isPolling) {
      limparTimer();
      return;
    }

    timerId.current = setTimeout(() => {
      consultar();
    }, intervaloMs);

    return limparTimer;
  }, [consultar, intervaloMs, limparTimer, isPolling]);

  const forcarConsulta = useCallback(async () => {
    limparTimer();
    await consultar();
  }, [consultar, limparTimer]);

  return {
    ...state,
    forcarConsulta,
    isPolling,
  };
}
