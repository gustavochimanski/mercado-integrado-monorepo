/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinalizarPedidoRequest } from '../models/FinalizarPedidoRequest';
import type { PagamentoGatewayEnum } from '../models/PagamentoGatewayEnum';
import type { PagamentoMetodoEnum } from '../models/PagamentoMetodoEnum';
import type { PedidoKanbanResponse } from '../models/PedidoKanbanResponse';
import type { PedidoResponse } from '../models/PedidoResponse';
import type { PedidoStatusEnum } from '../models/PedidoStatusEnum';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PedidosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Pedidos Admin Kanban
     * Lista pedidos do sistema (para admin, versão resumida pro Kanban)
     * @returns PedidoKanbanResponse Successful Response
     * @throws ApiError
     */
    public listarPedidosAdminKanbanApiDeliveryPedidosAdminKanbanGet(): CancelablePromise<Array<PedidoKanbanResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/pedidos/admin/kanban',
        });
    }
    /**
     * Atualizar Status Pedido
     * Atualiza o status de um pedido (somente admin).
     * @param pedidoId ID do pedido
     * @param status Novo status do pedido
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarStatusPedidoApiDeliveryPedidosStatusPedidoIdPut(
        pedidoId: number,
        status: PedidoStatusEnum,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/pedidos/status/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            query: {
                'status': status,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Checkout
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public checkoutApiDeliveryPedidosCheckoutPost(
        xSuperToken: string,
        requestBody: FinalizarPedidoRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/pedidos/checkout',
            headers: {
                'x-super-token': xSuperToken,
            },
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
        metodo: PagamentoMetodoEnum = 'PIX',
        gateway: PagamentoGatewayEnum = 'PIX_INTERNO',
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
    /**
     * Listar Pedidos
     * @param xSuperToken
     * @param skip
     * @param limit
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public listarPedidosApiDeliveryPedidosGet(
        xSuperToken: string,
        skip?: number,
        limit: number = 50,
    ): CancelablePromise<Array<PedidoResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/pedidos/',
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Pedido
     * @param pedidoId ID do pedido
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public getPedidoApiDeliveryPedidosPedidoIdGet(
        pedidoId: number,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/pedidos/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
