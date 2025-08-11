/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProdutoMiniDTO } from './ProdutoMiniDTO';
export type ProdutoEmpMiniDTO = {
    empresa_id: number;
    cod_barras: string;
    preco_venda: number;
    vitrine_id?: (number | null);
    disponivel?: boolean;
    produto: ProdutoMiniDTO;
};

