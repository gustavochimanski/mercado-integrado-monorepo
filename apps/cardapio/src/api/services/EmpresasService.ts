/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_empresa_api_mensura_empresas__post } from '../models/Body_create_empresa_api_mensura_empresas__post';
import type { Body_update_empresa_api_mensura_empresas__id__put } from '../models/Body_update_empresa_api_mensura_empresas__id__put';
import type { EmpresaResponse } from '../models/EmpresaResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class EmpresasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Empresa
     * @param formData
     * @returns EmpresaResponse Successful Response
     * @throws ApiError
     */
    public createEmpresaApiMensuraEmpresasPost(
        formData: Body_create_empresa_api_mensura_empresas__post,
    ): CancelablePromise<EmpresaResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mensura/empresas/',
            formData: formData,
            mediaType: 'multipart/form-data',
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
    public listEmpresasApiMensuraEmpresasGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<EmpresaResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/empresas/',
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
     * Update Empresa
     * @param id
     * @param formData
     * @returns EmpresaResponse Successful Response
     * @throws ApiError
     */
    public updateEmpresaApiMensuraEmpresasIdPut(
        id: number,
        formData?: Body_update_empresa_api_mensura_empresas__id__put,
    ): CancelablePromise<EmpresaResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/empresas/{id}',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
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
    public getEmpresaApiMensuraEmpresasIdGet(
        id: number,
    ): CancelablePromise<EmpresaResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/empresas/{id}',
            path: {
                'id': id,
            },
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
    public deleteEmpresaApiMensuraEmpresasIdDelete(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mensura/empresas/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
