/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoriaMiniSchema } from './CategoriaMiniSchema';
import type { VitrineComProdutosResponse } from './VitrineComProdutosResponse';
export type CategoryPageResponse = {
    categoria: CategoriaMiniSchema;
    subcategorias: Array<CategoriaMiniSchema>;
    vitrines: Array<VitrineComProdutosResponse>;
    vitrines_filho: Array<VitrineComProdutosResponse>;
};

