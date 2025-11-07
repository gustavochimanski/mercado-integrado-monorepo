/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CaixaConferenciaEsperadoResponse } from './CaixaConferenciaEsperadoResponse';
/**
 * Resposta com valores esperados por tipo de pagamento para um caixa aberto
 */
export type CaixaValoresEsperadosResponse = {
    caixa_id: number;
    empresa_id: number;
    data_abertura: string;
    valor_inicial_dinheiro: number;
    valores_por_meio: Array<CaixaConferenciaEsperadoResponse>;
    total_esperado_dinheiro: number;
};

