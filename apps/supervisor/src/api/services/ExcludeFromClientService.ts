/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PagamentoGatewayEnum } from '../models/PagamentoGatewayEnum';
import type { PagamentoMetodoEnum } from '../models/PagamentoMetodoEnum';
import type { PedidoResponse } from '../models/PedidoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ExcludeFromClientService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Confirmar Pagamento
     * @param pedidoId ID do pedido
     * @param metodo Método de pagamento
     * @param gateway Gateway de pagamento
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public confirmarPagamentoApiDeliveryClientePedidosPedidoIdConfirmarPagamentoPost(
        pedidoId: number,
        metodo: PagamentoMetodoEnum = 'PIX',
        gateway: PagamentoGatewayEnum = 'PIX_INTERNO',
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/cliente/pedidos/{pedido_id}/confirmar-pagamento',
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
