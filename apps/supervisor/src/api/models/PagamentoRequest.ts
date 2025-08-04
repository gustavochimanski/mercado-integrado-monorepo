/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PagamentoRequest = {
    /**
     * ID do pedido a ser pago
     */
    pedido_id: number;
    /**
     * boleto, credit_card ou pix
     */
    metodo_pagamento: string;
    /**
     * Token do cartão (se for crédito)
     */
    token_cartao?: (string | null);
};

