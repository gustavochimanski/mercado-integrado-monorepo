/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProdutoListItem } from './ProdutoListItem';
export type ProdutosPaginadosResponse = {
    data: Array<ProdutoListItem>;
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
};

