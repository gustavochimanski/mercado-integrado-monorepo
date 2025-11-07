/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdicionarItemRequest } from '../models/AdicionarItemRequest';
import type { FecharContaBalcaoRequest } from '../models/FecharContaBalcaoRequest';
import type { HistoricoPedidoBalcaoResponse } from '../models/HistoricoPedidoBalcaoResponse';
import type { PedidoBalcaoCreate } from '../models/PedidoBalcaoCreate';
import type { PedidoBalcaoOut } from '../models/PedidoBalcaoOut';
import type { RemoverItemResponse } from '../models/RemoverItemResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ApiBalcOService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar pedidos abertos
     * Lista todos os pedidos de balcão que estão abertos (não finalizados).
     *
     * **Status considerados abertos:**
     * - PENDENTE
     * - CONFIRMADO
     * - PREPARANDO
     * - PRONTO
     *
     * **Ordenação:** Pedidos mais recentes primeiro.
     * @returns PedidoBalcaoOut Lista de pedidos abertos
     * @throws ApiError
     */
    public listPedidosAbertosApiBalcaoAdminPedidosGet(): CancelablePromise<Array<PedidoBalcaoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/balcao/admin/pedidos',
        });
    }
    /**
     * Criar pedido de balcão
     * Cria um novo pedido de balcão.
     *
     * **Características:**
     * - `mesa_id` é opcional (pode criar pedido sem mesa)
     * - Pode ou não ter `cliente_id` associado
     * - Permite adicionar itens durante a criação
     *
     * **Status inicial:** PENDENTE
     * @param requestBody
     * @returns PedidoBalcaoOut Pedido criado com sucesso
     * @throws ApiError
     */
    public criarPedidoApiBalcaoAdminPedidosPost(
        requestBody: PedidoBalcaoCreate,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/admin/pedidos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Dados inválidos ou produto não encontrado`,
                404: `Mesa não encontrada (se mesa_id informado)`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Adicionar item ao pedido
     * Adiciona um novo item ao pedido de balcão.
     *
     * **Validações:**
     * - Pedido deve estar aberto (não pode ser CANCELADO ou ENTREGUE)
     * - Produto deve existir e estar disponível
     * - Quantidade deve ser maior que zero
     *
     * **Atualização automática:** O valor total do pedido é recalculado automaticamente.
     * @param pedidoId ID do pedido
     * @param requestBody
     * @returns PedidoBalcaoOut Item adicionado com sucesso
     * @throws ApiError
     */
    public adicionarItemApiBalcaoAdminPedidosPedidoIdItensPost(
        pedidoId: number,
        requestBody: AdicionarItemRequest,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/admin/pedidos/{pedido_id}/itens',
            path: {
                'pedido_id': pedidoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Pedido fechado/cancelado ou dados inválidos`,
                404: `Pedido ou produto não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remover item do pedido
     * Remove um item específico do pedido de balcão.
     *
     * **Validações:**
     * - Pedido deve estar aberto (não pode ser CANCELADO ou ENTREGUE)
     * - Item deve existir no pedido
     *
     * **Atualização automática:** O valor total do pedido é recalculado automaticamente.
     * @param pedidoId ID do pedido
     * @param itemId ID do item a ser removido
     * @returns RemoverItemResponse Item removido com sucesso
     * @throws ApiError
     */
    public removerItemApiBalcaoAdminPedidosPedidoIdItensItemIdDelete(
        pedidoId: number,
        itemId: number,
    ): CancelablePromise<RemoverItemResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/balcao/admin/pedidos/{pedido_id}/itens/{item_id}',
            path: {
                'pedido_id': pedidoId,
                'item_id': itemId,
            },
            errors: {
                400: `Pedido fechado/cancelado`,
                404: `Pedido ou item não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cancelar pedido
     * Cancela um pedido de balcão, alterando seu status para CANCELADO.
     *
     * **Observação:** Pedidos cancelados não podem ser modificados.
     * @param pedidoId ID do pedido a ser cancelado
     * @returns PedidoBalcaoOut Pedido cancelado com sucesso
     * @throws ApiError
     */
    public cancelarPedidoApiBalcaoAdminPedidosPedidoIdCancelarPost(
        pedidoId: number,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/admin/pedidos/{pedido_id}/cancelar',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Fechar conta do pedido
     * Fecha a conta de um pedido de balcão, alterando seu status para ENTREGUE.
     *
     * **Informações de pagamento (opcional):**
     * - `meio_pagamento_id`: ID do meio de pagamento utilizado
     * - `troco_para`: Valor para o qual deseja troco (apenas para pagamento em dinheiro)
     *
     * **Observação:** As informações de pagamento são salvas nas observações do pedido.
     * @param pedidoId ID do pedido
     * @param requestBody
     * @returns PedidoBalcaoOut Conta fechada com sucesso
     * @throws ApiError
     */
    public fecharContaPedidoApiBalcaoAdminPedidosPedidoIdFecharContaPost(
        pedidoId: number,
        requestBody?: (FecharContaBalcaoRequest | null),
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/admin/pedidos/{pedido_id}/fechar-conta',
            path: {
                'pedido_id': pedidoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reabrir pedido
     * Reabre um pedido que foi cancelado ou entregue, alterando seu status para CONFIRMADO.
     *
     * **Validação:** Apenas pedidos com status CANCELADO ou ENTREGUE podem ser reabertos.
     * @param pedidoId ID do pedido a ser reaberto
     * @returns PedidoBalcaoOut Pedido reaberto com sucesso
     * @throws ApiError
     */
    public reabrirPedidoApiBalcaoAdminPedidosPedidoIdReabrirPost(
        pedidoId: number,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/admin/pedidos/{pedido_id}/reabrir',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirmar pedido
     * Confirma um pedido de balcão, alterando seu status de PENDENTE para CONFIRMADO.
     *
     * **Fluxo de status:**
     * - PENDENTE → CONFIRMADO → PREPARANDO → PRONTO → ENTREGUE
     *
     * **Observação:** O valor total do pedido é recalculado automaticamente.
     * @param pedidoId ID do pedido a ser confirmado
     * @returns PedidoBalcaoOut Pedido confirmado com sucesso
     * @throws ApiError
     */
    public confirmarPedidoApiBalcaoAdminPedidosPedidoIdConfirmarPost(
        pedidoId: number,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/admin/pedidos/{pedido_id}/confirmar',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Buscar pedido por ID
     * Busca um pedido de balcão específico pelo ID.
     *
     * **Retorna:**
     * - Informações completas do pedido
     * - Lista de itens do pedido
     * - Status atual
     * - Valor total
     * - Dados do cliente (se associado)
     * - Mesa (se associada)
     * @param pedidoId ID do pedido
     * @returns PedidoBalcaoOut Pedido encontrado
     * @throws ApiError
     */
    public getPedidoApiBalcaoAdminPedidosPedidoIdGet(
        pedidoId: number,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/balcao/admin/pedidos/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar pedidos finalizados
     * Lista todos os pedidos de balcão que foram finalizados (status ENTREGUE).
     *
     * **Filtros disponíveis:**
     * - `data`: Filtra por data específica (YYYY-MM-DD). Se não informado, retorna todos os pedidos finalizados.
     *
     * **Ordenação:** Pedidos mais recentes primeiro.
     * @param data Filtrar por data (YYYY-MM-DD). Se não informado, retorna todos os pedidos finalizados
     * @returns PedidoBalcaoOut Lista de pedidos finalizados
     * @throws ApiError
     */
    public listPedidosFinalizadosApiBalcaoAdminPedidosFinalizadosGet(
        data?: (string | null),
    ): CancelablePromise<Array<PedidoBalcaoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/balcao/admin/pedidos/finalizados',
            query: {
                'data': data,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter histórico do pedido
     * Obtém o histórico completo de alterações de um pedido de balcão.
     *
     * **Retorna:**
     * - Todas as operações realizadas no pedido
     * - Alterações de status
     * - Adição/remoção de itens
     * - Informações de quem executou cada operação
     * - Timestamps de cada operação
     *
     * **Ordenação:** Operações mais recentes primeiro.
     * @param pedidoId ID do pedido
     * @param limit Limite de registros de histórico
     * @returns HistoricoPedidoBalcaoResponse Histórico retornado com sucesso
     * @throws ApiError
     */
    public obterHistoricoPedidoApiBalcaoAdminPedidosPedidoIdHistoricoGet(
        pedidoId: number,
        limit: number = 100,
    ): CancelablePromise<HistoricoPedidoBalcaoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/balcao/admin/pedidos/{pedido_id}/historico',
            path: {
                'pedido_id': pedidoId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
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
