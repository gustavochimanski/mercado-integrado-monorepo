/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Resposta com informações de conferência por meio de pagamento
 */
export type ConferenciaMeioPagamentoResponse = {
    meio_pagamento_id: number;
    meio_pagamento_nome: string;
    meio_pagamento_tipo: string;
    valor_esperado: number;
    valor_conferido: number;
    diferenca: number;
    quantidade_transacoes: number;
    observacoes?: (string | null);
};

