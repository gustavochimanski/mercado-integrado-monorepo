/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConferenciaMeioPagamentoResponse } from './ConferenciaMeioPagamentoResponse';
/**
 * Resumo das conferências do caixa por tipo de pagamento
 */
export type CaixaConferenciaResumoResponse = {
    caixa_id: number;
    conferencias: Array<ConferenciaMeioPagamentoResponse>;
};

