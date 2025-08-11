/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoriaDeliveryOut } from '../models/CategoriaDeliveryOut';
import type { VitrineComProdutosResponse } from '../models/VitrineComProdutosResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CardPioService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Cardapio
     * Retorna a árvore (nível raiz) de categorias do cardápio para a empresa.
     * @param empresaId ID da empresa
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public listarCardapioApiDeliveryCardapioGet(
        empresaId: number,
    ): CancelablePromise<Array<CategoriaDeliveryOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/cardapio',
            query: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Vitrines E Produtos Por Categoria
     * Retorna as vitrines (e seus produtos) vinculadas a uma categoria.
     * @param empresaId
     * @param codCategoria
     * @returns VitrineComProdutosResponse Successful Response
     * @throws ApiError
     */
    public listarVitrinesEProdutosPorCategoriaApiDeliveryProdutosVitrinePorCategoriaGet(
        empresaId: number,
        codCategoria: number,
    ): CancelablePromise<Array<VitrineComProdutosResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/produtos/vitrine-por-categoria',
            query: {
                'empresa_id': empresaId,
                'cod_categoria': codCategoria,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
