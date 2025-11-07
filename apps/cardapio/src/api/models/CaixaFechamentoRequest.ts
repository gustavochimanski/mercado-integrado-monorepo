/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConferenciaMeioPagamento } from './ConferenciaMeioPagamento';
export type CaixaFechamentoRequest = {
    /**
     * Valor real contado no fechamento (dinheiro físico)
     */
    saldo_real: (number | string);
    observacoes_fechamento?: (string | null);
    /**
     * Conferências por tipo de meio de pagamento
     */
    conferencias?: Array<ConferenciaMeioPagamento>;
};

