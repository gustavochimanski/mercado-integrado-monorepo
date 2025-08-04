/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoriaDeliveryOut } from '../models/CategoriaDeliveryOut';
import type { VitrineComProdutosResponse } from '../models/VitrineComProdutosResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CardapioService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Cardapio
     * @param empresaId
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public listarCardapioDeliveryCardapioGet(
        empresaId: number,
    ): CancelablePromise<Array<CategoriaDeliveryOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/delivery/cardapio',
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
     * @param empresaId
     * @param codCategoria
     * @returns VitrineComProdutosResponse Successful Response
     * @throws ApiError
     */
    public listarVitrinesEProdutosPorCategoriaDeliveryProdutosVitrinePorCategoriaGet(
        empresaId: number,
        codCategoria: number,
    ): CancelablePromise<Array<VitrineComProdutosResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/delivery/produtos/vitrine-por-categoria',
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
