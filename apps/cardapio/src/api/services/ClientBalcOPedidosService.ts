/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FecharContaBalcaoRequest } from '../models/FecharContaBalcaoRequest';
import type { PedidoBalcaoOut } from '../models/PedidoBalcaoOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClientBalcOPedidosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Fechar conta do pedido (Cliente)
     * Permite que um cliente feche a conta de seu próprio pedido de balcão.
     *
     * **Autenticação:** Requer header `X-Super-Token` com o token do cliente.
     *
     * **Validações:**
     * - Cliente deve ser o dono do pedido (se pedido tiver cliente_id associado)
     * - Pedido deve existir
     *
     * **Informações de pagamento:**
     * - `meio_pagamento_id`: ID do meio de pagamento utilizado (opcional)
     * - `troco_para`: Valor para o qual deseja troco, apenas para pagamento em dinheiro (opcional)
     *
     * **Observação:** As informações de pagamento são salvas nas observações do pedido.
     * O status do pedido é alterado para ENTREGUE.
     * @param pedidoId ID do pedido
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoBalcaoOut Conta fechada com sucesso
     * @throws ApiError
     */
    public fecharContaPedidoClienteApiBalcaoClientPedidosPedidoIdFecharContaPost(
        pedidoId: number,
        xSuperToken: string,
        requestBody: FecharContaBalcaoRequest,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/client/pedidos/{pedido_id}/fechar-conta',
            path: {
                'pedido_id': pedidoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Não autenticado. Requer X-Super-Token`,
                403: `Pedido não pertence ao cliente`,
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
}
