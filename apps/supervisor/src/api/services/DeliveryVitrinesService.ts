/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CriarVitrineRequest } from '../models/CriarVitrineRequest';
import type { CriarVitrineResponse } from '../models/CriarVitrineResponse';
import type { VinculoRequest } from '../models/VinculoRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DeliveryVitrinesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Vitrines
     * @param empresaId ID da empresa
     * @param codCategoria Filtrar por ID da categoria
     * @returns CriarVitrineResponse Successful Response
     * @throws ApiError
     */
    public listarVitrinesApiDeliveryVitrinesGet(
        empresaId: number,
        codCategoria?: (number | null),
    ): CancelablePromise<Array<CriarVitrineResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/vitrines',
            query: {
                'empresa_id': empresaId,
                'cod_categoria': codCategoria,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Vitrine
     * @param requestBody
     * @returns CriarVitrineResponse Successful Response
     * @throws ApiError
     */
    public criarVitrineApiDeliveryVitrinesPost(
        requestBody: CriarVitrineRequest,
    ): CancelablePromise<CriarVitrineResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/vitrines',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Vitrine
     * @param vitrineId
     * @returns void
     * @throws ApiError
     */
    public deletarVitrineApiDeliveryVitrinesVitrineIdDelete(
        vitrineId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/vitrines/{vitrine_id}',
            path: {
                'vitrine_id': vitrineId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Vincular Produto
     * Vincula um produto (empresa x cod_barras) à vitrine.
     * @param vitrineId
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public vincularProdutoApiDeliveryVitrinesVitrineIdVincularPost(
        vitrineId: number,
        requestBody: VinculoRequest,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/vitrines/{vitrine_id}/vincular',
            path: {
                'vitrine_id': vitrineId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Desvincular Produto
     * Desvincula um produto (empresa x cod_barras) da vitrine.
     * @param vitrineId
     * @param codBarras
     * @param empresaId
     * @returns void
     * @throws ApiError
     */
    public desvincularProdutoApiDeliveryVitrinesVitrineIdVincularCodBarrasDelete(
        vitrineId: number,
        codBarras: string,
        empresaId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/vitrines/{vitrine_id}/vincular/{cod_barras}',
            path: {
                'vitrine_id': vitrineId,
                'cod_barras': codBarras,
            },
            query: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
