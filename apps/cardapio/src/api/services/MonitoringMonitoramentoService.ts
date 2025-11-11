/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MonitoringMonitoramentoService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Metrics
     * Endpoint de métricas Prometheus (público, sem autenticação).
     * Acesse em: /api/monitoring/metrics
     * @returns any Successful Response
     * @throws ApiError
     */
    public metricsApiMonitoringMetricsGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/monitoring/metrics',
        });
    }
    /**
     * View Logs
     * Visualiza logs da aplicação via web.
     * Acesse em: /api/monitoring/logs?lines=100&level=ERROR&search=erro
     * @param lines Número de linhas para exibir
     * @param level Filtrar por nível (INFO, ERROR, WARNING, DEBUG)
     * @param search Buscar texto nas linhas
     * @returns string Successful Response
     * @throws ApiError
     */
    public viewLogsApiMonitoringLogsGet(
        lines: number = 100,
        level?: (string | null),
        search?: (string | null),
    ): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/monitoring/logs',
            query: {
                'lines': lines,
                'level': level,
                'search': search,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Logs Json
     * Retorna logs em formato JSON.
     * @param lines
     * @param level
     * @param search
     * @returns any Successful Response
     * @throws ApiError
     */
    public getLogsJsonApiMonitoringLogsJsonGet(
        lines: number = 100,
        level?: (string | null),
        search?: (string | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/monitoring/logs/json',
            query: {
                'lines': lines,
                'level': level,
                'search': search,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
