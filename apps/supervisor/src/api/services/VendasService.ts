/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TypeDashboardRequest } from '../models/TypeDashboardRequest';
import type { TypeResumoVendasResponse } from '../models/TypeResumoVendasResponse';
import type { TypeVendaDetalhadaResponse } from '../models/TypeVendaDetalhadaResponse';
import type { TypeVendaPorHoraComTotalGeralResponse } from '../models/TypeVendaPorHoraComTotalGeralResponse';
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
    public resumoVendasControllerBiVendasPeriodoPost(
        requestBody: TypeDashboardRequest,
    ): CancelablePromise<TypeResumoVendasResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/bi/vendas/periodo',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Consulta venda Detalhada
     * @param requestBody
     * @returns TypeVendaDetalhadaResponse Successful Response
     * @throws ApiError
     */
    public consultaVendaDetalhadaControllerBiVendasVendaDetalhadaPost(
        requestBody: TypeDashboardRequest,
    ): CancelablePromise<TypeVendaDetalhadaResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/bi/vendas/venda-detalhada',
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
     * @returns TypeVendaPorHoraComTotalGeralResponse Successful Response
     * @throws ApiError
     */
    public consultaVendaPorHoraControllerBiVendasPorHoraPost(
        requestBody: TypeDashboardRequest,
    ): CancelablePromise<TypeVendaPorHoraComTotalGeralResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/bi/vendas/por-hora',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
