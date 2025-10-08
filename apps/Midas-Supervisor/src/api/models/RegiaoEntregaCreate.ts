/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegiaoEntregaCreate = {
    cep?: (string | null);
    bairro: string;
    cidade: string;
    uf: string;
    taxa_entrega: (number | string);
    ativo?: boolean;
    empresa_id: number;
};

