/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EditarPedidoRequest } from '../models/EditarPedidoRequest';
import type { FinalizarPedidoRequest } from '../models/FinalizarPedidoRequest';
import type { ItemPedidoEditar } from '../models/ItemPedidoEditar';
import type { ModoEdicaoRequest } from '../models/ModoEdicaoRequest';
import type { PagamentoGatewayEnum } from '../models/PagamentoGatewayEnum';
import type { PagamentoMetodoEnum } from '../models/PagamentoMetodoEnum';
import type { PedidoResponse } from '../models/PedidoResponse';
import type { PedidoResponseSimplificado } from '../models/PedidoResponseSimplificado';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PedidosClienteDeliveryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Checkout
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public checkoutApiDeliveryClientePedidosCheckoutPost(
        xSuperToken: string,
        requestBody: FinalizarPedidoRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/cliente/pedidos/checkout',
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
    /**
     * Listar Pedidos
     * Lista pedidos do cliente com dados simplificados incluindo nome do meio de pagamento
     * @param xSuperToken
     * @param skip
     * @param limit
     * @returns PedidoResponseSimplificado Successful Response
     * @throws ApiError
     */
    public listarPedidosApiDeliveryClientePedidosGet(
        xSuperToken: string,
        skip?: number,
        limit: number = 50,
    ): CancelablePromise<Array<PedidoResponseSimplificado>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/cliente/pedidos/',
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
     * Executa uma única ação sobre os itens do pedido do cliente: adicionar, atualizar ou remover.
     * @param pedidoId ID do pedido
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarItemClienteApiDeliveryClientePedidosPedidoIdItensPut(
        pedidoId: number,
        xSuperToken: string,
        requestBody: ItemPedidoEditar,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/cliente/pedidos/{pedido_id}/itens',
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
     * Atualiza dados de um pedido existente, mas somente se for do próprio cliente.
     * @param pedidoId ID do pedido a ser atualizado
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarPedidoClienteApiDeliveryClientePedidosPedidoIdEditarPut(
        pedidoId: number,
        xSuperToken: string,
        requestBody: EditarPedidoRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/cliente/pedidos/{pedido_id}/editar',
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
    public alterarModoEdicaoApiDeliveryClientePedidosPedidoIdModoEdicaoPut(
        pedidoId: number,
        xSuperToken: string,
        requestBody: ModoEdicaoRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/cliente/pedidos/{pedido_id}/modo-edicao',
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
