/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Schema de resposta para preview do checkout (sem criar pedido)
 * Calcula subtotal, taxas, desconto, total, distância e tempo de entrega.
 */
export type PreviewCheckoutResponse = {
    subtotal: number;
    taxa_entrega: number;
    taxa_servico: number;
    valor_total: number;
    desconto: number;
    distancia_km?: (number | null);
    empresa_id?: (number | null);
    tempo_entrega_minutos?: (number | null);
};

