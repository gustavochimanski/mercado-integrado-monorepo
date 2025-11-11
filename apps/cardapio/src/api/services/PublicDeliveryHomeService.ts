/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryPageResponse } from '../models/CategoryPageResponse';
import type { HomeResponse } from '../models/HomeResponse';
import type { VitrineComProdutosResponse } from '../models/VitrineComProdutosResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicDeliveryHomeService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Home
     * @param empresaId ID da empresa
     * @param isHome Filtra home: categorias raiz e/ou vitrines da home
     * @returns HomeResponse Successful Response
     * @throws ApiError
     */
    public listarHomeApiCardapioPublicHomeHomeGet(
        empresaId: number,
        isHome: boolean,
    ): CancelablePromise<HomeResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/public/home/home',
            query: {
                'empresa_id': empresaId,
                'is_home': isHome,
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
     * @param slug
     * @returns VitrineComProdutosResponse Successful Response
     * @throws ApiError
     */
    public listarVitrinesEProdutosPorCategoriaApiCardapioPublicHomeHomeVitrinePorCategoriaGet(
        empresaId: number,
        codCategoria?: (number | null),
        slug?: (string | null),
    ): CancelablePromise<Array<VitrineComProdutosResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/public/home/home/vitrine-por-categoria',
            query: {
                'empresa_id': empresaId,
                'cod_categoria': codCategoria,
                'slug': slug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Categoria Page
     * @param empresaId
     * @param slug Slug da categoria atual
     * @returns CategoryPageResponse Successful Response
     * @throws ApiError
     */
    public getCategoriaPageApiCardapioPublicHomeHomeCategoriaGet(
        empresaId: number,
        slug: string,
    ): CancelablePromise<CategoryPageResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/public/home/home/categoria',
            query: {
                'empresa_id': empresaId,
                'slug': slug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
