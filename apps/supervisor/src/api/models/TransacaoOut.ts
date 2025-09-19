/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PagamentoGatewayEnum } from './PagamentoGatewayEnum';
import type { PagamentoMetodoEnum } from './PagamentoMetodoEnum';
import type { PagamentoStatusEnum } from './PagamentoStatusEnum';
export type TransacaoOut = {
    id: number;
    pedido_id: number;
    gateway: PagamentoGatewayEnum;
    metodo: PagamentoMetodoEnum;
    valor: number;
    moeda: string;
    status: PagamentoStatusEnum;
    provider_transaction_id: (string | null);
    qr_code: (string | null);
    qr_code_base64: (string | null);
    payload_solicitacao: (Record<string, any> | null);
    payload_retorno: (Record<string, any> | null);
    autorizado_em: (string | null);
    pago_em: (string | null);
    cancelado_em: (string | null);
    estornado_em: (string | null);
    created_at: string;
    updated_at: string;
};

