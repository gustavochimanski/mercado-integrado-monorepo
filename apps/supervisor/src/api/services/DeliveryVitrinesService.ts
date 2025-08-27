/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AtualizarVitrineRequest } from '../models/AtualizarVitrineRequest';
import type { CriarVitrineRequest } from '../models/CriarVitrineRequest';
import type { ToggleHomeRequest } from '../models/ToggleHomeRequest';
import type { VinculoRequest } from '../models/VinculoRequest';
import type { VitrineOut } from '../models/VitrineOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DeliveryVitrinesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Search Vitrines
     * @param q Busca por título/slug
     * @param codCategoria Filtra por categoria vinculada
     * @param isHome Filtra por destaque da home
     * @param limit
     * @param offset
     * @returns VitrineOut Successful Response
     * @throws ApiError
     */
    public searchVitrinesApiDeliveryVitrinesSearchGet(
        q?: (string | null),
        codCategoria?: (number | null),
        isHome?: (boolean | null),
        limit: number = 30,
        offset?: number,
    ): CancelablePromise<Array<VitrineOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/vitrines/search',
            query: {
                'q': q,
                'cod_categoria': codCategoria,
                'is_home': isHome,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Toggle Home Vitrine
     * @param vitrineId ID da vitrine
     * @param requestBody
     * @returns VitrineOut Successful Response
     * @throws ApiError
     */
    public toggleHomeVitrineApiDeliveryVitrinesVitrineIdHomePatch(
        vitrineId: number,
        requestBody: ToggleHomeRequest,
    ): CancelablePromise<VitrineOut> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/delivery/vitrines/{vitrine_id}/home',
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
     * Criar Vitrine
     * @param requestBody
     * @returns VitrineOut Successful Response
     * @throws ApiError
     */
    public criarVitrineApiDeliveryVitrinesPost(
        requestBody: CriarVitrineRequest,
    ): CancelablePromise<VitrineOut> {
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
     * Atualizar Vitrine
     * @param vitrineId ID da vitrine
     * @param requestBody
     * @returns VitrineOut Successful Response
     * @throws ApiError
     */
    public atualizarVitrineApiDeliveryVitrinesVitrineIdPut(
        vitrineId: number,
        requestBody: AtualizarVitrineRequest,
    ): CancelablePromise<VitrineOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/vitrines/{vitrine_id}',
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
     * Deletar Vitrine
     * @param vitrineId ID da vitrine
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
     * @param vitrineId ID da vitrine
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
     * @param vitrineId ID da vitrine
     * @param codBarras Código de barras do produto
     * @param empresaId Empresa do vínculo
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
