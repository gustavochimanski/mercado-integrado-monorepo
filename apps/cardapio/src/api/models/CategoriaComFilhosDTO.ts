/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CategoriaComFilhosDTO = {
    id: number;
    descricao: string;
    ativo: boolean;
    parent_id?: (number | null);
    created_at: string;
    updated_at: string;
    children?: Array<CategoriaComFilhosDTO>;
};

