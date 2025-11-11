/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PedidoPendenteImpressaoResponse } from '../models/PedidoPendenteImpressaoResponse';
import type { RespostaImpressaoPrinter } from '../models/RespostaImpressaoPrinter';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicCardPioPrinterService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Pedidos Pendentes Impressao
     * Lista todos os pedidos pendentes de impressão de uma empresa.
     * @param empresaId ID da empresa
     * @param limite Número máximo de pedidos para listar
     * @returns PedidoPendenteImpressaoResponse Successful Response
     * @throws ApiError
     */
    public listarPedidosPendentesImpressaoApiDeliveryPrinterPedidosPendentesGet(
        empresaId: number,
        limite: number = 50,
    ): CancelablePromise<Array<PedidoPendenteImpressaoResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/printer/pedidos-pendentes',
            query: {
                'empresa_id': empresaId,
                'limite': limite,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Marcar Pedido Impresso Manual
     * Marca um pedido como impresso manualmente (sem usar Printer API).
     * Útil quando a impressão é feita externamente.
     * @param pedidoId ID do pedido
     * @returns RespostaImpressaoPrinter Successful Response
     * @throws ApiError
     */
    public marcarPedidoImpressoManualApiDeliveryPrinterMarcarImpressoPedidoIdPut(
        pedidoId: number,
    ): CancelablePromise<RespostaImpressaoPrinter> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/printer/marcar-impresso/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Estatisticas Impressao
     * Retorna estatísticas de impressão para uma empresa.
     * @param empresaId ID da empresa
     * @returns any Successful Response
     * @throws ApiError
     */
    public getEstatisticasImpressaoApiDeliveryPrinterEstatisticasGet(
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/printer/estatisticas',
            query: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
