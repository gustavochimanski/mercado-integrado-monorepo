/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema de resposta para preview do checkout (sem criar pedido)
 * Calcula subtotal, taxas, desconto, total e distância sem criar o pedido.
 */
export type PreviewCheckoutResponse = {
    subtotal: number;
    taxa_entrega: number;
    desconto: number;
    valor_total: number;
    distancia_km?: (number | null);
};

