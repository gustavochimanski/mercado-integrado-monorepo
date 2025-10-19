/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmpresaClientOut } from '../models/EmpresaClientOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicMensuraEmpresasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Buscar Empresa Client
     * @param empresaId
     * @returns EmpresaClientOut Successful Response
     * @throws ApiError
     */
    public buscarEmpresaClientApiMensuraPublicEmpGet(
        empresaId: number,
    ): CancelablePromise<EmpresaClientOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/public/emp/',
            query: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
