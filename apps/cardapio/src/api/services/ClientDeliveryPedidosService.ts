/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EditarPedidoRequest } from '../models/EditarPedidoRequest';
import type { FinalizarPedidoRequest } from '../models/FinalizarPedidoRequest';
import type { ItemPedidoEditar } from '../models/ItemPedidoEditar';
import type { ModoEdicaoRequest } from '../models/ModoEdicaoRequest';
import type { PedidoResponse } from '../models/PedidoResponse';
import type { PedidoResponseSimplificado } from '../models/PedidoResponseSimplificado';
import type { PreviewCheckoutResponse } from '../models/PreviewCheckoutResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClientDeliveryPedidosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Preview Checkout
     * Calcula o preview do checkout (subtotal, taxas, desconto, total)
     * sem criar o pedido no banco de dados.
     *
     * Este endpoint é útil para mostrar ao cliente os valores antes de finalizar o pedido.
     * @param xSuperToken
     * @param requestBody
     * @returns PreviewCheckoutResponse Successful Response
     * @throws ApiError
     */
    public previewCheckoutApiDeliveryClientPedidosCheckoutPreviewPost(
        xSuperToken: string,
        requestBody: FinalizarPedidoRequest,
    ): CancelablePromise<PreviewCheckoutResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/client/pedidos/checkout/preview',
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
     * Listar Pedidos
     * Lista pedidos do cliente com dados simplificados incluindo nome do meio de pagamento
     * @param xSuperToken
     * @param skip
     * @param limit
     * @returns PedidoResponseSimplificado Successful Response
     * @throws ApiError
     */
    public listarPedidosApiDeliveryClientPedidosGet(
        xSuperToken: string,
        skip?: number,
        limit: number = 50,
    ): CancelablePromise<Array<PedidoResponseSimplificado>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/client/pedidos/',
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
     * Atualizar Item Cliente
     * Atualiza itens de um pedido do cliente.
     *
     * - **pedido_id**: ID do pedido
     * - **item**: Objeto com a ação a ser executada (adicionar, atualizar, remover)
     * @param pedidoId ID do pedido
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarItemClienteApiDeliveryClientPedidosPedidoIdItensPut(
        pedidoId: number,
        xSuperToken: string,
        requestBody: ItemPedidoEditar,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/client/pedidos/{pedido_id}/itens',
            path: {
                'pedido_id': pedidoId,
            },
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
     * Atualizar Pedido Cliente
     * ⚠️ DEPRECATED: Use o Gateway Orquestrador (/api/pedidos/{pedido_id}/editar)
     *
     * Este endpoint está sendo substituído pelo Gateway Orquestrador que unifica
     * endpoints de admin e client em um único endpoint.
     *
     * **Recomendado:** Use `PUT /api/pedidos/{pedido_id}/editar`
     *
     * Este endpoint será mantido apenas para compatibilidade retroativa.
     * @param pedidoId ID do pedido a ser atualizado
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarPedidoClienteApiDeliveryClientPedidosPedidoIdEditarPut(
        pedidoId: number,
        xSuperToken: string,
        requestBody: EditarPedidoRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/client/pedidos/{pedido_id}/editar',
            path: {
                'pedido_id': pedidoId,
            },
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
     * Alterar Modo Edicao
     * Altera o modo de edição do pedido.
     * True = ativa modo edição (status X), False = finaliza edição (status D)
     * @param pedidoId ID do pedido
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public alterarModoEdicaoApiDeliveryClientPedidosPedidoIdModoEdicaoPut(
        pedidoId: number,
        xSuperToken: string,
        requestBody: ModoEdicaoRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/client/pedidos/{pedido_id}/modo-edicao',
            path: {
                'pedido_id': pedidoId,
            },
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
}
