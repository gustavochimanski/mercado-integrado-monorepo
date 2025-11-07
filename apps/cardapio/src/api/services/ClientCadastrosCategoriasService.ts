/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoriaDeliveryOut } from '../models/CategoriaDeliveryOut';
import type { CategoriaSearchOut } from '../models/CategoriaSearchOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClientCadastrosCategoriasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Search Categorias
     * @param xSuperToken
     * @param q Termo de busca por descrição/slug
     * @param limit
     * @param offset
     * @returns CategoriaSearchOut Successful Response
     * @throws ApiError
     */
    public searchCategoriasApiCadastrosClientCategoriasSearchGet(
        xSuperToken: string,
        q?: (string | null),
        limit: number = 30,
        offset?: number,
    ): CancelablePromise<Array<CategoriaSearchOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/client/categorias/search',
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
                'q': q,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Categoria
     * @param catId
     * @param xSuperToken
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public getCategoriaApiCadastrosClientCategoriasCatIdGet(
        catId: number,
        xSuperToken: string,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/client/categorias/{cat_id}',
            path: {
                'cat_id': catId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
