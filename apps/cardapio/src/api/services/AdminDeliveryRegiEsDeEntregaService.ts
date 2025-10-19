/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RegiaoEntregaCreate } from '../models/RegiaoEntregaCreate';
import type { RegiaoEntregaOut } from '../models/RegiaoEntregaOut';
import type { RegiaoEntregaUpdate } from '../models/RegiaoEntregaUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminDeliveryRegiEsDeEntregaService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Regioes
     * @param empresaId
     * @returns RegiaoEntregaOut Successful Response
     * @throws ApiError
     */
    public listRegioesApiDeliveryAdminRegioesEntregaEmpresaIdGet(
        empresaId: number,
    ): CancelablePromise<Array<RegiaoEntregaOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/admin/regioes-entrega/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Regiao
     * @param regiaoId
     * @returns RegiaoEntregaOut Successful Response
     * @throws ApiError
     */
    public getRegiaoApiDeliveryAdminRegioesEntregaDetalhesRegiaoIdGet(
        regiaoId: number,
    ): CancelablePromise<RegiaoEntregaOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/admin/regioes-entrega/detalhes/{regiao_id}',
            path: {
                'regiao_id': regiaoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Regiao
     * @param requestBody
     * @returns RegiaoEntregaOut Successful Response
     * @throws ApiError
     */
    public createRegiaoApiDeliveryAdminRegioesEntregaPost(
        requestBody: RegiaoEntregaCreate,
    ): CancelablePromise<RegiaoEntregaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/admin/regioes-entrega/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Regiao
     * @param regiaoId
     * @param requestBody
     * @returns RegiaoEntregaOut Successful Response
     * @throws ApiError
     */
    public updateRegiaoApiDeliveryAdminRegioesEntregaRegiaoIdPut(
        regiaoId: number,
        requestBody: RegiaoEntregaUpdate,
    ): CancelablePromise<RegiaoEntregaOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/admin/regioes-entrega/{regiao_id}',
            path: {
                'regiao_id': regiaoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Regiao
     * @param regiaoId
     * @returns any Successful Response
     * @throws ApiError
     */
    public deleteRegiaoApiDeliveryAdminRegioesEntregaRegiaoIdDelete(
        regiaoId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/admin/regioes-entrega/{regiao_id}',
            path: {
                'regiao_id': regiaoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
