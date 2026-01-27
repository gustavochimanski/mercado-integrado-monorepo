/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_atualizar_imagem_categoria_api_cardapio_admin_categorias__categoria_id__imagem_patch } from '../models/Body_atualizar_imagem_categoria_api_cardapio_admin_categorias__categoria_id__imagem_patch';
import type { CategoriaDeliveryAdminIn } from '../models/CategoriaDeliveryAdminIn';
import type { CategoriaDeliveryAdminUpdate } from '../models/CategoriaDeliveryAdminUpdate';
import type { CategoriaDeliveryOut } from '../models/CategoriaDeliveryOut';
import type { CategoriaSearchOut } from '../models/CategoriaSearchOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminCardapioCategoriasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Categorias
     * @param codEmpresa
     * @param parentId Quando informado, retorna apenas as categorias filhas do ID informado.
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public listarCategoriasApiCardapioAdminCategoriasGet(
        codEmpresa: number,
        parentId?: (number | null),
    ): CancelablePromise<Array<CategoriaDeliveryOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/admin/categorias/',
            query: {
                'cod_empresa': codEmpresa,
                'parent_id': parentId,
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
    public criarCategoriaApiCardapioAdminCategoriasPost(
        requestBody: CategoriaDeliveryAdminIn,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/categorias/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Buscar Categorias
     * @param codEmpresa
     * @param q Termo de busca por descrição ou slug.
     * @param limit
     * @param offset
     * @returns CategoriaSearchOut Successful Response
     * @throws ApiError
     */
    public buscarCategoriasApiCardapioAdminCategoriasSearchGet(
        codEmpresa: number,
        q?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<CategoriaSearchOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/admin/categorias/search',
            query: {
                'cod_empresa': codEmpresa,
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
     * Obter Categoria
     * @param categoriaId
     * @param codEmpresa
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public obterCategoriaApiCardapioAdminCategoriasCategoriaIdGet(
        categoriaId: number,
        codEmpresa: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/admin/categorias/{categoria_id}',
            path: {
                'categoria_id': categoriaId,
            },
            query: {
                'cod_empresa': codEmpresa,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Categoria
     * @param categoriaId
     * @param requestBody
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public atualizarCategoriaApiCardapioAdminCategoriasCategoriaIdPut(
        categoriaId: number,
        requestBody: CategoriaDeliveryAdminUpdate,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cardapio/admin/categorias/{categoria_id}',
            path: {
                'categoria_id': categoriaId,
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
     * @param categoriaId
     * @param codEmpresa Identificador da empresa proprietária da categoria. Quando informado, remove também a imagem associada.
     * @returns void
     * @throws ApiError
     */
    public deletarCategoriaApiCardapioAdminCategoriasCategoriaIdDelete(
        categoriaId: number,
        codEmpresa: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cardapio/admin/categorias/{categoria_id}',
            path: {
                'categoria_id': categoriaId,
            },
            query: {
                'cod_empresa': codEmpresa,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Imagem Categoria
     * @param categoriaId
     * @param formData
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public atualizarImagemCategoriaApiCardapioAdminCategoriasCategoriaIdImagemPatch(
        categoriaId: number,
        formData: Body_atualizar_imagem_categoria_api_cardapio_admin_categorias__categoria_id__imagem_patch,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/cardapio/admin/categorias/{categoria_id}/imagem',
            path: {
                'categoria_id': categoriaId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mover Categoria Para Esquerda
     * @param categoriaId
     * @param codEmpresa
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public moverCategoriaParaEsquerdaApiCardapioAdminCategoriasCategoriaIdMoveLeftPost(
        categoriaId: number,
        codEmpresa: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/categorias/{categoria_id}/move-left',
            path: {
                'categoria_id': categoriaId,
            },
            query: {
                'cod_empresa': codEmpresa,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mover Categoria Para Direita
     * @param categoriaId
     * @param codEmpresa
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public moverCategoriaParaDireitaApiCardapioAdminCategoriasCategoriaIdMoveRightPost(
        categoriaId: number,
        codEmpresa: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/categorias/{categoria_id}/move-right',
            path: {
                'categoria_id': categoriaId,
            },
            query: {
                'cod_empresa': codEmpresa,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
