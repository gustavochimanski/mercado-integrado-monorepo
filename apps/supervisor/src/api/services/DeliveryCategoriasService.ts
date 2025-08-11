/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_criar_categoria_api_delivery_categorias_post } from '../models/Body_criar_categoria_api_delivery_categorias_post';
import type { Body_editar_categoria_api_delivery_categorias__cat_id__put } from '../models/Body_editar_categoria_api_delivery_categorias__cat_id__put';
import type { CategoriaDeliveryOut } from '../models/CategoriaDeliveryOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DeliveryCategoriasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Categorias
     * @param parentId Filtra por pai (subcategorias)
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public listCategoriasApiDeliveryCategoriasGet(
        parentId?: (number | null),
    ): CancelablePromise<Array<CategoriaDeliveryOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/categorias',
            query: {
                'parent_id': parentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Categoria
     * @param formData
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public criarCategoriaApiDeliveryCategoriasPost(
        formData: Body_criar_categoria_api_delivery_categorias_post,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/categorias',
            formData: formData,
            mediaType: 'multipart/form-data',
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
     * @param formData
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public editarCategoriaApiDeliveryCategoriasCatIdPut(
        catId: number,
        formData: Body_editar_categoria_api_delivery_categorias__cat_id__put,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/categorias/{cat_id}',
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
     * Toggle Home
     * Alterna `tipo_exibicao` para exibir na Home (valor 'P') ou remover.
     * @param catId
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public toggleHomeApiDeliveryCategoriasCatIdToggleHomePost(
        catId: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/categorias/{cat_id}/toggle-home',
            path: {
                'cat_id': catId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
