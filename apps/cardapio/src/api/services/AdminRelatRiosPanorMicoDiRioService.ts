/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminRelatRiosPanorMicoDiRioService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Relatorio Panoramico
     * @param inicio Início do período no formato YYYY-MM-DD
     * @param fim Fim do período no formato YYYY-MM-DD
     * @param empresaId Identificador da empresa
     * @returns any Successful Response
     * @throws ApiError
     */
    public relatorioPanoramicoApiRelatoriosAdminRelatoriosPanoramicoGet(
        inicio: string,
        fim: string,
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/relatorios/admin/relatorios/panoramico',
            query: {
                'inicio': inicio,
                'fim': fim,
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Relatorio Panoramico Diario
     * @param data Dia de referência (YYYY-MM-DD)
     * @param empresaId Identificador da empresa
     * @returns any Successful Response
     * @throws ApiError
     */
    public relatorioPanoramicoDiarioApiRelatoriosAdminRelatoriosPanoramicoDiaGet(
        data: string,
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/relatorios/admin/relatorios/panoramico-dia',
            query: {
                'data': data,
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Panoramico Ranking Bairro
     * @param inicio Início do período (YYYY-MM-DD)
     * @param fim Fim do período (YYYY-MM-DD)
     * @param empresaId Identificador da empresa
     * @param limite Quantidade de bairros no ranking
     * @returns any Successful Response
     * @throws ApiError
     */
    public panoramicoRankingBairroApiRelatoriosAdminRelatoriosPanoramicoRankingBairroGet(
        inicio: string,
        fim: string,
        empresaId: number,
        limite: number = 10,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/relatorios/admin/relatorios/panoramico/ranking-bairro',
            query: {
                'inicio': inicio,
                'fim': fim,
                'empresa_id': empresaId,
                'limite': limite,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Panoramico Ultimos 7 Dias
     * @param referencia Data de referência (YYYY-MM-DD) - inclui os 7 dias até ela
     * @param empresaId Identificador da empresa
     * @returns any Successful Response
     * @throws ApiError
     */
    public panoramicoUltimos7DiasApiRelatoriosAdminRelatoriosPanoramicoUltimos7DiasGet(
        referencia: string,
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/relatorios/admin/relatorios/panoramico/ultimos-7-dias',
            query: {
                'referencia': referencia,
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Panoramico Pico Hora
     * @param inicio Início do período (YYYY-MM-DD)
     * @param fim Fim do período (YYYY-MM-DD)
     * @param empresaId Identificador da empresa
     * @returns any Successful Response
     * @throws ApiError
     */
    public panoramicoPicoHoraApiRelatoriosAdminRelatoriosPanoramicoPicoHoraGet(
        inicio: string,
        fim: string,
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/relatorios/admin/relatorios/panoramico/pico-hora',
            query: {
                'inicio': inicio,
                'fim': fim,
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
