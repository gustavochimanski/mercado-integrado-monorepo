/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_put_product_by_fied_produtos__produto_id__put } from '../models/Body_put_product_by_fied_produtos__produto_id__put';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Buscar códigos das empresas ativas
     * @returns any Successful Response
     * @throws ApiError
     */
    public getEmpresasCodigosEmpresasGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/empresas',
        });
    }
    /**
     * Buscar objetos completos das empresas ativas
     * @returns any Successful Response
     * @throws ApiError
     */
    public getEmpresasCompletasEmpresasDetalhesGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/empresas/detalhes',
        });
    }
    /**
     * Get Paginated Products
     * @param page
     * @param limit
     * @returns any Successful Response
     * @throws ApiError
     */
    public getPaginatedProductsProdutosGet(
        page: number = 1,
        limit: number = 30,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/produtos',
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Put Product By Fied
     * @param produtoId
     * @param field Nome do campo a ser atualizado
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public putProductByFiedProdutosProdutoIdPut(
        produtoId: number,
        field: string,
        requestBody: Body_put_product_by_fied_produtos__produto_id__put,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/produtos/{produto_id}',
            path: {
                'produto_id': produtoId,
            },
            query: {
                'field': field,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
