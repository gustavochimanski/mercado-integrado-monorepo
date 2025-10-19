/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_empresa_api_mensura_admin_empresas__post } from '../models/Body_create_empresa_api_mensura_admin_empresas__post';
import type { Body_update_empresa_api_mensura_admin_empresas__id__put } from '../models/Body_update_empresa_api_mensura_admin_empresas__id__put';
import type { EmpresaCardapioLinkResponse } from '../models/EmpresaCardapioLinkResponse';
import type { EmpresaResponse } from '../models/EmpresaResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminMensuraEmpresasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Cardapio Links
     * @returns EmpresaCardapioLinkResponse Successful Response
     * @throws ApiError
     */
    public listCardapioLinksApiMensuraAdminEmpresasCardapiosGet(): CancelablePromise<Array<EmpresaCardapioLinkResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/empresas/cardapios',
        });
    }
    /**
     * Create Empresa
     * @param formData
     * @returns EmpresaResponse Successful Response
     * @throws ApiError
     */
    public createEmpresaApiMensuraAdminEmpresasPost(
        formData: Body_create_empresa_api_mensura_admin_empresas__post,
    ): CancelablePromise<EmpresaResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mensura/admin/empresas/',
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
    public listEmpresasApiMensuraAdminEmpresasGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<EmpresaResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/empresas/',
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
    public updateEmpresaApiMensuraAdminEmpresasIdPut(
        id: number,
        formData?: Body_update_empresa_api_mensura_admin_empresas__id__put,
    ): CancelablePromise<EmpresaResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/admin/empresas/{id}',
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
    public getEmpresaApiMensuraAdminEmpresasIdGet(
        id: number,
    ): CancelablePromise<EmpresaResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/empresas/{id}',
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
    public deleteEmpresaApiMensuraAdminEmpresasIdDelete(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mensura/admin/empresas/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
