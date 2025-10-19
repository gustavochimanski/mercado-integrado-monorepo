/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PedidoPagamentoResumo } from './PedidoPagamentoResumo';
import type { PedidoStatusEnum } from './PedidoStatusEnum';
export type PedidoKanbanResponse = {
    id: number;
    status: PedidoStatusEnum;
    cliente_id?: (number | null);
    telefone_cliente?: (string | null);
    nome_cliente?: (string | null);
    valor_total: number;
    data_criacao: string;
    observacao_geral?: (string | null);
    endereco?: (string | null);
    meio_pagamento_id?: (number | null);
    meio_pagamento_descricao?: (string | null);
    entregador?: (Record<string, any> | null);
    pagamento?: (PedidoPagamentoResumo | null);
};

