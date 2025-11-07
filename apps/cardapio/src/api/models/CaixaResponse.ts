/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CaixaResponse = {
    id: number;
    empresa_id: number;
    usuario_id_abertura: number;
    usuario_id_fechamento?: (number | null);
    valor_inicial: number;
    valor_final?: (number | null);
    saldo_esperado?: (number | null);
    saldo_real?: (number | null);
    diferenca?: (number | null);
    status: string;
    data_abertura: string;
    data_fechamento?: (string | null);
    observacoes_abertura?: (string | null);
    observacoes_fechamento?: (string | null);
    created_at: string;
    updated_at: string;
    empresa_nome?: (string | null);
    usuario_abertura_nome?: (string | null);
    usuario_fechamento_nome?: (string | null);
};

