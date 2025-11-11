/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdicionarItemRequest } from '../models/AdicionarItemRequest';
import type { AtualizarObservacoesRequest } from '../models/AtualizarObservacoesRequest';
import type { FecharContaMesaRequest } from '../models/FecharContaMesaRequest';
import type { PedidoMesaCreate } from '../models/PedidoMesaCreate';
import type { PedidoMesaOut } from '../models/PedidoMesaOut';
import type { RemoverItemResponse } from '../models/RemoverItemResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminMesasPedidosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Criar Pedido
     * @param requestBody
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public criarPedidoApiMesasAdminPedidosPost(
        requestBody: PedidoMesaCreate,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/pedidos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Pedidos Abertos
     * @param mesaId Filtrar por mesa
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public listPedidosAbertosApiMesasAdminPedidosGet(
        mesaId?: (number | null),
    ): CancelablePromise<Array<PedidoMesaOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/pedidos',
            query: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Adicionar Item
     * @param pedidoId
     * @param requestBody
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public adicionarItemApiMesasAdminPedidosPedidoIdItensPost(
        pedidoId: number,
        requestBody?: AdicionarItemRequest,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/pedidos/{pedido_id}/itens',
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
    /**
     * Remover Item
     * @param pedidoId
     * @param itemId
     * @returns RemoverItemResponse Successful Response
     * @throws ApiError
     */
    public removerItemApiMesasAdminPedidosPedidoIdItensItemIdDelete(
        pedidoId: number,
        itemId: number,
    ): CancelablePromise<RemoverItemResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mesas/admin/pedidos/{pedido_id}/itens/{item_id}',
            path: {
                'pedido_id': pedidoId,
                'item_id': itemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cancelar Pedido
     * @param pedidoId
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public cancelarPedidoApiMesasAdminPedidosPedidoIdCancelarPost(
        pedidoId: number,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/pedidos/{pedido_id}/cancelar',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Fechar Conta Pedido
     * @param pedidoId
     * @param requestBody
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public fecharContaPedidoApiMesasAdminPedidosPedidoIdFecharContaPost(
        pedidoId: number,
        requestBody?: (FecharContaMesaRequest | null),
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/pedidos/{pedido_id}/fechar-conta',
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
    /**
     * Reabrir Pedido
     * @param pedidoId
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public reabrirPedidoApiMesasAdminPedidosPedidoIdReabrirPost(
        pedidoId: number,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/pedidos/{pedido_id}/reabrir',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirmar Pedido
     * @param pedidoId
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public confirmarPedidoApiMesasAdminPedidosPedidoIdConfirmarPost(
        pedidoId: number,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/pedidos/{pedido_id}/confirmar',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Pedido
     * @param pedidoId
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public getPedidoApiMesasAdminPedidosPedidoIdGet(
        pedidoId: number,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/pedidos/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Observacoes Pedido
     * Atualiza as observações de um pedido
     * @param pedidoId ID do pedido
     * @param requestBody
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public atualizarObservacoesPedidoApiMesasAdminPedidosPedidoIdPut(
        pedidoId: number,
        requestBody: AtualizarObservacoesRequest,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mesas/admin/pedidos/{pedido_id}',
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
    /**
     * List Pedidos Finalizados
     * Retorna todos os pedidos finalizados (ENTREGUE) da mesa especificada, opcionalmente filtrados por data
     * @param mesaId ID da mesa
     * @param data Filtrar por data (YYYY-MM-DD). Se não informado, retorna todos os pedidos finalizados da mesa
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public listPedidosFinalizadosApiMesasAdminPedidosFinalizadosMesaIdGet(
        mesaId: number,
        data?: (string | null),
    ): CancelablePromise<Array<PedidoMesaOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/pedidos/finalizados/{mesa_id}',
            path: {
                'mesa_id': mesaId,
            },
            query: {
                'data': data,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
