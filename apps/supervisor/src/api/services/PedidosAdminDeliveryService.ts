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
export class PedidosAdminDeliveryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Pedidos Admin Kanban
     * Lista pedidos do sistema para visualização no Kanban (admin).
     *
     * - **date_filter**: Filtra pedidos por data específica (formato YYYY-MM-DD)
     * - **empresa_id**: ID da empresa (obrigatório, deve ser maior que 0)
     *
     * Retorna lista de pedidos com informações resumidas para o Kanban.
     * @param empresaId ID da empresa para filtrar pedidos
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
     * Busca um pedido específico com informações completas (admin).
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     *
     * Retorna todos os dados do pedido incluindo itens, cliente, endereço, etc.
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
     * Atualiza dados de um pedido existente (admin).
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     * - **payload**: Dados para atualização
     *
     * Campos que podem ser atualizados:
     * - **meio_pagamento_id**: ID do meio de pagamento
     * - **endereco_id**: ID do endereço de entrega
     * - **cupom_id**: ID do cupom de desconto
     * - **observacao_geral**: Observação geral do pedido
     * - **troco_para**: Valor do troco para
     * - **itens**: Lista de itens do pedido
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
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     * - **novo_status**: Novo status do pedido (obrigatório)
     *
     * Status disponíveis: PENDENTE, CONFIRMADO, PREPARANDO, PRONTO, SAIU_PARA_ENTREGA, ENTREGUE, CANCELADO
     * @param pedidoId ID do pedido
     * @param novoStatus Novo status do pedido
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarStatusPedidoApiDeliveryPedidosAdminStatusPedidoIdPut(
        pedidoId: number,
        novoStatus: PedidoStatusEnum,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/pedidos/admin/status/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            query: {
                'novo_status': novoStatus,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Itens
     * Atualiza os itens de um pedido: adicionar, atualizar quantidade/observação ou remover.
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     * - **itens**: Lista de itens para atualizar (obrigatório)
     *
     * Para cada item:
     * - **item_id**: ID do item (para atualizar/remover) ou null (para adicionar)
     * - **produto_id**: ID do produto (obrigatório para novos itens)
     * - **quantidade**: Quantidade do item (obrigatório)
     * - **observacao**: Observação específica do item (opcional)
     * - **remover**: true para remover o item (opcional)
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
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     * - **entregador_id**: ID do entregador para vincular ou null para desvincular
     *
     * Para vincular: envie entregador_id com o ID do entregador
     * Para desvincular: envie entregador_id como null
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
