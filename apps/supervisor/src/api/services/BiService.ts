/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConsultaMovimentoCompraRequest } from '../models/ConsultaMovimentoCompraRequest';
import type { ConsultaMovimentoCompraResponse } from '../models/ConsultaMovimentoCompraResponse';
import type { MetasEmpresa } from '../models/MetasEmpresa';
import type { TypeConsultaMetaRequest } from '../models/TypeConsultaMetaRequest';
import type { TypeDashboardMetaReturn } from '../models/TypeDashboardMetaReturn';
import type { TypeDashboardRequest } from '../models/TypeDashboardRequest';
import type { TypeInserirMetaRequest } from '../models/TypeInserirMetaRequest';
import type { TypeResumoVendasResponse } from '../models/TypeResumoVendasResponse';
import type { TypeVendaPorHoraResponse } from '../models/TypeVendaPorHoraResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class BiService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Resumo Compras Empresa
     * Endpoint para consultar movimentos de compra:
     * - Recebe datas e lista de empresas.
     * - Injetamos a sessão do DB via Depends(get_db).
     * - Encaminha para o service e trata exceções.
     * @param requestBody
     * @returns ConsultaMovimentoCompraResponse Successful Response
     * @throws ApiError
     */
    public handleConsultaMovimentoCompraApiBiComprasConsultaMovimentoPost(
        requestBody: ConsultaMovimentoCompraRequest,
    ): CancelablePromise<ConsultaMovimentoCompraResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/bi/compras/consulta_movimento',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Dashboard Visão panorâmica
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public dashboardControllerApiBiDashboardPeriodoPost(
        requestBody: TypeDashboardRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/bi/dashboard/periodo',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
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
