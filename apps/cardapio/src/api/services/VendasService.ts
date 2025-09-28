/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TypeDashboardRequest } from '../models/TypeDashboardRequest';
import type { TypeResumoVendasResponse } from '../models/TypeResumoVendasResponse';
import type { TypeVendaPorHoraResponse } from '../models/TypeVendaPorHoraResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class VendasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Resumo vendas Periodo
     * @param requestBody
     * @returns TypeResumoVendasResponse Successful Response
     * @throws ApiError
     */
    public resumoVendasControllerApiBiVendasPeriodoPost(
        requestBody: TypeDashboardRequest,
    ): CancelablePromise<TypeResumoVendasResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/bi/vendas/periodo',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Venda por hora
     * @param requestBody
     * @returns TypeVendaPorHoraResponse Successful Response
     * @throws ApiError
     */
    public consultaVendaPorHoraControllerApiBiVendasPorHoraPost(
        requestBody: TypeDashboardRequest,
    ): CancelablePromise<TypeVendaPorHoraResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/bi/vendas/por-hora',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
