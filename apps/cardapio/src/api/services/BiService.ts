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
import type { TypeVendaDetalhadaResponse } from '../models/TypeVendaDetalhadaResponse';
import type { TypeVendaPorHoraResponse } from '../models/TypeVendaPorHoraResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class BiService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Consulta Metas  Período
     * @param requestBody
     * @returns TypeDashboardMetaReturn Successful Response
     * @throws ApiError
     */
    public obterTotalMetasGeralBiMetasPeriodoPost(
        requestBody: TypeConsultaMetaRequest,
    ): CancelablePromise<TypeDashboardMetaReturn> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/bi/metas/periodo',
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
    public inserirMetaControllerBiMetasInsertPost(
        requestBody: TypeInserirMetaRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/bi/metas/insert',
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
    public gerarMetaVendaControllerBiGerarVendaPost(
        requestBody: TypeConsultaMetaRequest,
    ): CancelablePromise<Array<MetasEmpresa>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/bi/gerar-venda',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Dados Dashboard geral
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public dashboardControllerBiDashboardPeriodoPost(
        requestBody: TypeDashboardRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/bi/dashboard/periodo',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
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
    public handleConsultaMovimentoCompraBiComprasConsultaMovimentoPost(
        requestBody: ConsultaMovimentoCompraRequest,
    ): CancelablePromise<ConsultaMovimentoCompraResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/bi/compras/consulta_movimento',
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
     * @returns TypeVendaPorHoraResponse Successful Response
     * @throws ApiError
     */
    public consultaVendaPorHoraControllerBiVendasPorHoraPost(
        requestBody: TypeDashboardRequest,
    ): CancelablePromise<TypeVendaPorHoraResponse> {
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
