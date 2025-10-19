/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PedidoResponse } from '../models/PedidoResponse';
import type { TransacaoStatusUpdateRequest } from '../models/TransacaoStatusUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminDeliveryPagamentosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Atualizar Status Pagamento
     * Atualiza o status do pagamento a partir de um evento externo (webhook/admin).
     * @param pedidoId ID do pedido
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarStatusPagamentoApiDeliveryAdminPagamentosPedidoIdStatusPost(
        pedidoId: number,
        requestBody: TransacaoStatusUpdateRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/admin/pagamentos/{pedido_id}/status',
            path: {
                'pedido_id': pedidoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
