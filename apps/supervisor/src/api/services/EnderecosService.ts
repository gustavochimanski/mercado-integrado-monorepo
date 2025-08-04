/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnderecoCreate } from '../models/EnderecoCreate';
import type { EnderecoResponse } from '../models/EnderecoResponse';
import type { EnderecoUpdate } from '../models/EnderecoUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class EnderecosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Endereco
     * @param requestBody
     * @returns EnderecoResponse Successful Response
     * @throws ApiError
     */
    public createEnderecoMensuraEnderecosPost(
        requestBody: EnderecoCreate,
    ): CancelablePromise<EnderecoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/mensura/enderecos/',
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
    public listEnderecosMensuraEnderecosGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<EnderecoResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/mensura/enderecos/',
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
    public getEnderecoMensuraEnderecosIdGet(
        id: number,
    ): CancelablePromise<EnderecoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/mensura/enderecos/{id}',
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
    public updateEnderecoMensuraEnderecosIdPut(
        id: number,
        requestBody: EnderecoUpdate,
    ): CancelablePromise<EnderecoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/mensura/enderecos/{id}',
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
    public deleteEnderecoMensuraEnderecosIdDelete(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/mensura/enderecos/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
