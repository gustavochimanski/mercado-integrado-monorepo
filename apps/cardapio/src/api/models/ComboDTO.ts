/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ComboItemDTO } from './ComboItemDTO';
export type ComboDTO = {
    id: number;
    empresa_id: number;
    titulo: string;
    descricao: string;
    preco_total: number;
    custo_total?: (number | null);
    ativo: boolean;
    imagem?: (string | null);
    itens: Array<ComboItemDTO>;
    created_at: string;
    updated_at: string;
};

