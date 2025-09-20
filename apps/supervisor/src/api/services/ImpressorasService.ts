/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ImpressoraCreate } from '../models/ImpressoraCreate';
import type { ImpressoraResponse } from '../models/ImpressoraResponse';
import type { ImpressoraUpdate } from '../models/ImpressoraUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ImpressorasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Impressora
     * @param requestBody
     * @returns ImpressoraResponse Successful Response
     * @throws ApiError
     */
    public createImpressoraApiMensuraImpressorasPost(
        requestBody: ImpressoraCreate,
    ): CancelablePromise<ImpressoraResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mensura/impressoras/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Impressoras
     * @param skip
     * @param limit
     * @returns ImpressoraResponse Successful Response
     * @throws ApiError
     */
    public listImpressorasApiMensuraImpressorasGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<ImpressoraResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/impressoras/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Impressora
     * @param impressoraId
     * @returns ImpressoraResponse Successful Response
     * @throws ApiError
     */
    public getImpressoraApiMensuraImpressorasImpressoraIdGet(
        impressoraId: number,
    ): CancelablePromise<ImpressoraResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/impressoras/{impressora_id}',
            path: {
                'impressora_id': impressoraId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Impressora
     * @param impressoraId
     * @param requestBody
     * @returns ImpressoraResponse Successful Response
     * @throws ApiError
     */
    public updateImpressoraApiMensuraImpressorasImpressoraIdPut(
        impressoraId: number,
        requestBody: ImpressoraUpdate,
    ): CancelablePromise<ImpressoraResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/impressoras/{impressora_id}',
            path: {
                'impressora_id': impressoraId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Impressora
     * @param impressoraId
     * @returns void
     * @throws ApiError
     */
    public deleteImpressoraApiMensuraImpressorasImpressoraIdDelete(
        impressoraId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mensura/impressoras/{impressora_id}',
            path: {
                'impressora_id': impressoraId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Impressoras By Empresa
     * @param empresaId
     * @returns ImpressoraResponse Successful Response
     * @throws ApiError
     */
    public getImpressorasByEmpresaApiMensuraImpressorasEmpresaEmpresaIdGet(
        empresaId: number,
    ): CancelablePromise<Array<ImpressoraResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/impressoras/empresa/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
