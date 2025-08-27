/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_imagem_categoria_api_delivery_categorias__cat_id__imagem_patch } from '../models/Body_upload_imagem_categoria_api_delivery_categorias__cat_id__imagem_patch';
import type { CategoriaDeliveryIn } from '../models/CategoriaDeliveryIn';
import type { CategoriaDeliveryOut } from '../models/CategoriaDeliveryOut';
import type { CategoriaSearchOut } from '../models/CategoriaSearchOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DeliveryCategoriasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Search Categorias
     * @param q Termo de busca por descrição/slug
     * @param limit
     * @param offset
     * @returns CategoriaSearchOut Successful Response
     * @throws ApiError
     */
    public searchCategoriasApiDeliveryCategoriasSearchGet(
        q?: (string | null),
        limit: number = 30,
        offset?: number,
    ): CancelablePromise<Array<CategoriaSearchOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/categorias/search',
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
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public getCategoriaApiDeliveryCategoriasCatIdGet(
        catId: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/categorias/{cat_id}',
            path: {
                'cat_id': catId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Editar Categoria
     * @param catId
     * @param requestBody
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public editarCategoriaApiDeliveryCategoriasCatIdPut(
        catId: number,
        requestBody: CategoriaDeliveryIn,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/categorias/{cat_id}',
            path: {
                'cat_id': catId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Categoria
     * @param catId
     * @returns void
     * @throws ApiError
     */
    public deletarCategoriaApiDeliveryCategoriasCatIdDelete(
        catId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/categorias/{cat_id}',
            path: {
                'cat_id': catId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Categoria
     * @param requestBody
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public criarCategoriaApiDeliveryCategoriasPost(
        requestBody: CategoriaDeliveryIn,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/categorias',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Move Categoria Direita
     * @param catId
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public moveCategoriaDireitaApiDeliveryCategoriasCatIdMoveRightPost(
        catId: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/categorias/{cat_id}/move-right',
            path: {
                'cat_id': catId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Move Categoria Esquerda
     * @param catId
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public moveCategoriaEsquerdaApiDeliveryCategoriasCatIdMoveLeftPost(
        catId: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/categorias/{cat_id}/move-left',
            path: {
                'cat_id': catId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Imagem Categoria
     * @param catId
     * @param formData
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public uploadImagemCategoriaApiDeliveryCategoriasCatIdImagemPatch(
        catId: number,
        formData: Body_upload_imagem_categoria_api_delivery_categorias__cat_id__imagem_patch,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/delivery/categorias/{cat_id}/imagem',
            path: {
                'cat_id': catId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
