/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PagamentoGatewayEnum } from './PagamentoGatewayEnum';
import type { PagamentoMetodoEnum } from './PagamentoMetodoEnum';
import type { PagamentoStatusEnum } from './PagamentoStatusEnum';
export type PedidoPagamentoResumo = {
    status?: (PagamentoStatusEnum | null);
    esta_pago?: boolean;
    valor?: (number | null);
    atualizado_em?: (string | null);
    meio_pagamento_id?: (number | null);
    meio_pagamento_nome?: (string | null);
    metodo?: (PagamentoMetodoEnum | null);
    gateway?: (PagamentoGatewayEnum | null);
    provider_transaction_id?: (string | null);
};

