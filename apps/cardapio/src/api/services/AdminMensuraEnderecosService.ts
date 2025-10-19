/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__api__mensura__schemas__schema_endereco__EnderecoCreate } from '../models/app__api__mensura__schemas__schema_endereco__EnderecoCreate';
import type { app__api__mensura__schemas__schema_endereco__EnderecoUpdate } from '../models/app__api__mensura__schemas__schema_endereco__EnderecoUpdate';
import type { EnderecoResponse } from '../models/EnderecoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminMensuraEnderecosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Endereco
     * @param requestBody
     * @returns EnderecoResponse Successful Response
     * @throws ApiError
     */
    public createEnderecoApiMensuraAdminEnderecosPost(
        requestBody: app__api__mensura__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<EnderecoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mensura/admin/enderecos/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Enderecos
     * @param skip
     * @param limit
     * @returns EnderecoResponse Successful Response
     * @throws ApiError
     */
    public listEnderecosApiMensuraAdminEnderecosGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<EnderecoResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/enderecos/',
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
     * Get Endereco
     * @param id
     * @returns EnderecoResponse Successful Response
     * @throws ApiError
     */
    public getEnderecoApiMensuraAdminEnderecosIdGet(
        id: number,
    ): CancelablePromise<EnderecoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/enderecos/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Endereco
     * @param id
     * @param requestBody
     * @returns EnderecoResponse Successful Response
     * @throws ApiError
     */
    public updateEnderecoApiMensuraAdminEnderecosIdPut(
        id: number,
        requestBody: app__api__mensura__schemas__schema_endereco__EnderecoUpdate,
    ): CancelablePromise<EnderecoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/admin/enderecos/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Endereco
     * @param id
     * @returns void
     * @throws ApiError
     */
    public deleteEnderecoApiMensuraAdminEnderecosIdDelete(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mensura/admin/enderecos/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
