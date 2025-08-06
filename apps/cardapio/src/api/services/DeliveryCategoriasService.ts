/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_criar_categoria_delivery_categorias_delivery_post } from '../models/Body_criar_categoria_delivery_categorias_delivery_post';
import type { Body_editar_categoria_delivery_categorias_delivery__cat_id__put } from '../models/Body_editar_categoria_delivery_categorias_delivery__cat_id__put';
import type { CategoriaDeliveryOut } from '../models/CategoriaDeliveryOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DeliveryCategoriasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Categorias
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public listCategoriasDeliveryCategoriasDeliveryGet(): CancelablePromise<Array<CategoriaDeliveryOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/delivery/categorias/delivery',
        });
    }
    /**
     * Criar Categoria
     * @param formData
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public criarCategoriaDeliveryCategoriasDeliveryPost(
        formData: Body_criar_categoria_delivery_categorias_delivery_post,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/delivery/categorias/delivery',
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
    public getCategoriaDeliveryCategoriasDeliveryCatIdGet(
        catId: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/delivery/categorias/delivery/{cat_id}',
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
    public editarCategoriaDeliveryCategoriasDeliveryCatIdPut(
        catId: number,
        formData: Body_editar_categoria_delivery_categorias_delivery__cat_id__put,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/delivery/categorias/delivery/{cat_id}',
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
    public deletarCategoriaDeliveryCategoriasDeliveryCatIdDelete(
        catId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/delivery/categorias/delivery/{cat_id}',
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
    public moveCategoriaDireitaDeliveryCategoriasDeliveryCatIdMoveRightPost(
        catId: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/delivery/categorias/delivery/{cat_id}/move-right',
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
    public moveCategoriaEsquerdaDeliveryCategoriasDeliveryCatIdMoveLeftPost(
        catId: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/delivery/categorias/delivery/{cat_id}/move-left',
            path: {
                'cat_id': catId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
