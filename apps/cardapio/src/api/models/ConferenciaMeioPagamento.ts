/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Valor conferido para um meio de pagamento específico
 */
export type ConferenciaMeioPagamento = {
    /**
     * ID do meio de pagamento
     */
    meio_pagamento_id: number;
    /**
     * Valor conferido para este meio de pagamento
     */
    valor_conferido: (number | string);
    observacoes?: (string | null);
};

