/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MetasEmpresa } from '../models/MetasEmpresa';
import type { TypeConsultaMetaRequest } from '../models/TypeConsultaMetaRequest';
import type { TypeDashboardMetaReturn } from '../models/TypeDashboardMetaReturn';
import type { TypeInserirMetaRequest } from '../models/TypeInserirMetaRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MetasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Consulta Metas  Período
     * @param requestBody
     * @returns TypeDashboardMetaReturn Successful Response
     * @throws ApiError
     */
    public obterTotalMetasGeralApiBiMetasPeriodoPost(
        requestBody: TypeConsultaMetaRequest,
    ): CancelablePromise<TypeDashboardMetaReturn> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/bi/metas/periodo',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Inserir Meta por tipo e data
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public inserirMetaControllerApiBiMetasInsertPost(
        requestBody: TypeInserirMetaRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/bi/metas/insert',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Gerar metas de venda (metaVenda) com base no histórico
     * @param requestBody
     * @returns MetasEmpresa Successful Response
     * @throws ApiError
     */
    public gerarMetaVendaControllerApiBiMetasGerarVendaPost(
        requestBody: TypeConsultaMetaRequest,
    ): CancelablePromise<Array<MetasEmpresa>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/bi/metas/gerar-venda',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
