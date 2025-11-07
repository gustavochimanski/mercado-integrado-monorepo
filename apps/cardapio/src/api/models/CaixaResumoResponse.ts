/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Resumo do caixa para listagem
 */
export type CaixaResumoResponse = {
    id: number;
    empresa_id: number;
    empresa_nome?: (string | null);
    usuario_abertura_nome?: (string | null);
    valor_inicial: number;
    valor_final?: (number | null);
    saldo_esperado?: (number | null);
    saldo_real?: (number | null);
    diferenca?: (number | null);
    status: string;
    data_abertura: string;
    data_fechamento?: (string | null);
};

