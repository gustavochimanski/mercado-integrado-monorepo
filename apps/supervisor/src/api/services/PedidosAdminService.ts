/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EditarPedidoRequest } from '../models/EditarPedidoRequest';
import type { ItemPedidoEditar } from '../models/ItemPedidoEditar';
import type { PedidoKanbanResponse } from '../models/PedidoKanbanResponse';
import type { PedidoResponse } from '../models/PedidoResponse';
import type { PedidoResponseCompletoTotal } from '../models/PedidoResponseCompletoTotal';
import type { PedidoStatusEnum } from '../models/PedidoStatusEnum';
import type { VincularEntregadorRequest } from '../models/VincularEntregadorRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PedidosAdminService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Pedidos Admin Kanban
     * Lista pedidos do sistema (para admin, versão resumida pro Kanban)
     * @param empresaId
     * @param dateFilter Filtrar pedidos por data (YYYY-MM-DD)
     * @returns PedidoKanbanResponse Successful Response
     * @throws ApiError
     */
    public listarPedidosAdminKanbanApiDeliveryPedidosAdminKanbanGet(
        empresaId: number,
        dateFilter?: (string | null),
    ): CancelablePromise<Array<PedidoKanbanResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/pedidos/admin/kanban',
            query: {
                'date_filter': dateFilter,
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Pedido
     * @param pedidoId ID do pedido
     * @returns PedidoResponseCompletoTotal Successful Response
     * @throws ApiError
     */
    public getPedidoApiDeliveryPedidosAdminPedidoIdGet(
        pedidoId: number,
    ): CancelablePromise<PedidoResponseCompletoTotal> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/pedidos/admin/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Pedido
     * Atualiza dados de um pedido existente:
     * - meio_pagamento_id
     * - endereco_id
     * - cupom_id
     * - observacao_geral
     * - troco_para
     * - itens
     * @param pedidoId ID do pedido a ser atualizado
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarPedidoApiDeliveryPedidosAdminPedidoIdPut(
        pedidoId: number,
        requestBody: EditarPedidoRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/pedidos/admin/{pedido_id}',
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
     * Atualizar Status Pedido
     * Atualiza o status de um pedido (somente admin).
     * @param pedidoId ID do pedido
     * @param status Novo status do pedido
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarStatusPedidoApiDeliveryPedidosAdminStatusPedidoIdPut(
        pedidoId: number,
        status: PedidoStatusEnum,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/pedidos/admin/status/{pedido_id}',
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
     * Atualizar Itens
     * Atualiza os itens de um pedido: adicionar, atualizar quantidade/observação ou remover.
     * @param pedidoId ID do pedido
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarItensApiDeliveryPedidosAdminPedidoIdItensPut(
        pedidoId: number,
        requestBody: Array<ItemPedidoEditar>,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/pedidos/admin/{pedido_id}/itens',
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
     * Vincular Entregador
     * Vincula ou desvincula um entregador a um pedido.
     * - Para vincular: envie entregador_id com o ID do entregador
     * - Para desvincular: envie entregador_id como null
     * @param pedidoId ID do pedido
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public vincularEntregadorApiDeliveryPedidosAdminPedidoIdEntregadorPut(
        pedidoId: number,
        requestBody: VincularEntregadorRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/pedidos/admin/{pedido_id}/entregador',
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
