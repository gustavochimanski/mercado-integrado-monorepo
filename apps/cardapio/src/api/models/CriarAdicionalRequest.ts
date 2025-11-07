/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CriarAdicionalRequest = {
    empresa_id: number;
    nome: string;
    descricao?: (string | null);
    preco?: (number | string);
    ativo?: boolean;
    obrigatorio?: boolean;
    permite_multipla_escolha?: boolean;
    ordem?: number;
};

