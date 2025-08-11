/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinalizarPedidoRequest } from '../models/FinalizarPedidoRequest';
import type { PagamentoGatewayEnum } from '../models/PagamentoGatewayEnum';
import type { PagamentoMetodoEnum } from '../models/PagamentoMetodoEnum';
import type { PedidoResponse } from '../models/PedidoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PedidosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Checkout
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public checkoutApiDeliveryPedidosCheckoutPost(
        requestBody: FinalizarPedidoRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/pedidos/checkout',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirmar Pagamento
     * @param pedidoId ID do pedido
     * @param metodo
     * @param gateway
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public confirmarPagamentoApiDeliveryPedidosPedidoIdConfirmarPagamentoPost(
        pedidoId: number,
        metodo?: PagamentoMetodoEnum,
        gateway?: PagamentoGatewayEnum,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/pedidos/{pedido_id}/confirmar-pagamento',
            path: {
                'pedido_id': pedidoId,
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
}
