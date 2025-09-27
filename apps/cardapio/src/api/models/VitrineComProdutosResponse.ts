/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProdutoEmpMiniDTO } from './ProdutoEmpMiniDTO';
export type VitrineComProdutosResponse = {
    id: number;
    titulo: string;
    slug: string;
    ordem: number;
    produtos: Array<ProdutoEmpMiniDTO>;
    is_home: boolean;
    cod_categoria?: (number | null);
    href_categoria?: (string | null);
};

