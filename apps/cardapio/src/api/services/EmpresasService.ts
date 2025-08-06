/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmpresaCreate } from '../models/EmpresaCreate';
import type { EmpresaResponse } from '../models/EmpresaResponse';
import type { EmpresaUpdate } from '../models/EmpresaUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class EmpresasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Empresa
     * @param requestBody
     * @returns EmpresaResponse Successful Response
     * @throws ApiError
     */
    public createEmpresaMensuraEmpresasPost(
        requestBody: EmpresaCreate,
    ): CancelablePromise<EmpresaResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/mensura/empresas/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Empresas
     * @param skip
     * @param limit
     * @returns EmpresaResponse Successful Response
     * @throws ApiError
     */
    public listEmpresasMensuraEmpresasGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<EmpresaResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/mensura/empresas/',
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
     * Get Empresa
     * @param id
     * @returns EmpresaResponse Successful Response
     * @throws ApiError
     */
    public getEmpresaMensuraEmpresasIdGet(
        id: number,
    ): CancelablePromise<EmpresaResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/mensura/empresas/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Empresa
     * @param id
     * @param requestBody
     * @returns EmpresaResponse Successful Response
     * @throws ApiError
     */
    public updateEmpresaMensuraEmpresasIdPut(
        id: number,
        requestBody: EmpresaUpdate,
    ): CancelablePromise<EmpresaResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/mensura/empresas/{id}',
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
     * Delete Empresa
     * @param id
     * @returns void
     * @throws ApiError
     */
    public deleteEmpresaMensuraEmpresasIdDelete(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/mensura/empresas/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
