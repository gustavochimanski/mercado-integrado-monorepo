/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConsultarTransacaoResponse } from '../models/ConsultarTransacaoResponse';
import { PagamentoGatewayEnum } from '../models/PagamentoGatewayEnum';
import { PagamentoMetodoEnum } from '../models/PagamentoMetodoEnum';
import type { PedidoResponse } from '../models/PedidoResponse';
import type { TransacaoResponse } from '../models/TransacaoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClientDeliveryPagamentosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Confirmar Pagamento
     * @param pedidoId ID do pedido
     * @param xSuperToken
     * @param metodo Método de pagamento
     * @param gateway Gateway de pagamento
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public confirmarPagamentoApiDeliveryClientPagamentosPedidoIdConfirmarPost(
        pedidoId: number,
        xSuperToken: string,
        metodo: PagamentoMetodoEnum = PagamentoMetodoEnum.PIX,
        gateway: PagamentoGatewayEnum = PagamentoGatewayEnum.PIX_INTERNO,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/client/pagamentos/{pedido_id}/confirmar',
            path: {
                'pedido_id': pedidoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
                'metodo': metodo,
                'gateway': gateway,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Iniciar Pagamento
     * @param pedidoId ID do pedido
     * @param xSuperToken
     * @param metodo
     * @param gateway
     * @returns TransacaoResponse Successful Response
     * @throws ApiError
     */
    public iniciarPagamentoApiDeliveryClientPagamentosPedidoIdPost(
        pedidoId: number,
        xSuperToken: string,
        metodo: PagamentoMetodoEnum = PagamentoMetodoEnum.PIX_ONLINE,
        gateway: PagamentoGatewayEnum = PagamentoGatewayEnum.MERCADOPAGO,
    ): CancelablePromise<TransacaoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/client/pagamentos/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
                'metodo': metodo,
                'gateway': gateway,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Consultar Pagamento
     * @param pedidoId ID do pedido
     * @param providerId ID da transação no provedor
     * @param xSuperToken
     * @param gateway
     * @returns ConsultarTransacaoResponse Successful Response
     * @throws ApiError
     */
    public consultarPagamentoApiDeliveryClientPagamentosPedidoIdProviderIdGet(
        pedidoId: number,
        providerId: string,
        xSuperToken: string,
        gateway: PagamentoGatewayEnum = PagamentoGatewayEnum.MERCADOPAGO,
    ): CancelablePromise<ConsultarTransacaoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/client/pagamentos/{pedido_id}/{provider_id}',
            path: {
                'pedido_id': pedidoId,
                'provider_id': providerId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
                'gateway': gateway,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
