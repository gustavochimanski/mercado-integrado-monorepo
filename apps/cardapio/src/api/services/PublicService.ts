/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_put_product_by_fied_api_public_produtos__produto_id__put } from '../models/Body_put_product_by_fied_api_public_produtos__produto_id__put';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Buscar códigos das empresas ativas
     * @returns any Successful Response
     * @throws ApiError
     */
    public getEmpresasCodigosApiPublicEmpresasGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/public/empresas',
        });
    }
    /**
     * Buscar objetos completos das empresas ativas
     * @returns any Successful Response
     * @throws ApiError
     */
    public getEmpresasCompletasApiPublicEmpresasDetalhesGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/public/empresas/detalhes',
        });
    }
    /**
     * Get Paginated Products
     * @param page
     * @param limit
     * @returns any Successful Response
     * @throws ApiError
     */
    public getPaginatedProductsApiPublicProdutosGet(
        page: number = 1,
        limit: number = 30,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/public/produtos',
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
    public putProductByFiedApiPublicProdutosProdutoIdPut(
        produtoId: number,
        field: string,
        requestBody: Body_put_product_by_fied_api_public_produtos__produto_id__put,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/public/produtos/{produto_id}',
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
