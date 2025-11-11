/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__api__cadastros__schemas__schema_endereco__EnderecoCreate } from '../models/app__api__cadastros__schemas__schema_endereco__EnderecoCreate';
import type { app__api__cadastros__schemas__schema_endereco__EnderecoOut } from '../models/app__api__cadastros__schemas__schema_endereco__EnderecoOut';
import type { EnderecoUpdate } from '../models/EnderecoUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminMensuraEnderecosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Endereco
     * @param requestBody
     * @returns app__api__cadastros__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public createEnderecoApiMensuraAdminEnderecosPost(
        requestBody: app__api__cadastros__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<app__api__cadastros__schemas__schema_endereco__EnderecoOut> {
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
     * @returns app__api__cadastros__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public listEnderecosApiMensuraAdminEnderecosGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<app__api__cadastros__schemas__schema_endereco__EnderecoOut>> {
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
     * @returns app__api__cadastros__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public getEnderecoApiMensuraAdminEnderecosIdGet(
        id: number,
    ): CancelablePromise<app__api__cadastros__schemas__schema_endereco__EnderecoOut> {
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
     * @returns app__api__cadastros__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public updateEnderecoApiMensuraAdminEnderecosIdPut(
        id: number,
        requestBody: EnderecoUpdate,
    ): CancelablePromise<app__api__cadastros__schemas__schema_endereco__EnderecoOut> {
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
