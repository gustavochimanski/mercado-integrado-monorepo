/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdicionarItemRequest } from '../models/AdicionarItemRequest';
import type { AtualizarObservacoesRequest } from '../models/AtualizarObservacoesRequest';
import type { FecharContaMesaRequest } from '../models/FecharContaMesaRequest';
import type { HistoricoDaMesaResponse } from '../models/HistoricoDaMesaResponse';
import type { MesaIn } from '../models/MesaIn';
import type { MesaListOut } from '../models/MesaListOut';
import type { MesaOut } from '../models/MesaOut';
import type { MesaSearchOut } from '../models/MesaSearchOut';
import type { MesaStatsOut } from '../models/MesaStatsOut';
import type { MesaStatusUpdate } from '../models/MesaStatusUpdate';
import type { MesaUpdate } from '../models/MesaUpdate';
import type { PedidoMesaCreate } from '../models/PedidoMesaCreate';
import type { PedidoMesaOut } from '../models/PedidoMesaOut';
import type { RemoverItemResponse } from '../models/RemoverItemResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ApiMesasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get Mesa Stats
     * Retorna estatísticas das mesas
     * @returns MesaStatsOut Successful Response
     * @throws ApiError
     */
    public getMesaStatsApiMesasAdminMesasStatsGet(): CancelablePromise<MesaStatsOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/mesas/stats',
        });
    }
    /**
     * Search Mesas
     * Busca mesas com filtros
     * @param q Termo de busca por número/descrição
     * @param ativa Filtrar por status ativo
     * @param limit
     * @param offset
     * @returns MesaSearchOut Successful Response
     * @throws ApiError
     */
    public searchMesasApiMesasAdminMesasSearchGet(
        q?: (string | null),
        ativa?: (boolean | null),
        limit: number = 30,
        offset?: number,
    ): CancelablePromise<Array<MesaSearchOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/mesas/search',
            query: {
                'q': q,
                'ativa': ativa,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Mesas
     * Lista todas as mesas
     * @param ativa Filtrar por status ativo
     * @returns MesaListOut Successful Response
     * @throws ApiError
     */
    public listMesasApiMesasAdminMesasGet(
        ativa?: (boolean | null),
    ): CancelablePromise<Array<MesaListOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/mesas',
            query: {
                'ativa': ativa,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Mesa
     * Cria uma nova mesa
     * @param requestBody
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public criarMesaApiMesasAdminMesasPost(
        requestBody: MesaIn,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/mesas',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Mesa
     * Busca mesa por ID
     * @param mesaId
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public getMesaApiMesasAdminMesasMesaIdGet(
        mesaId: number,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/mesas/{mesa_id}',
            path: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Mesa
     * Atualiza uma mesa
     * @param mesaId
     * @param requestBody
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public atualizarMesaApiMesasAdminMesasMesaIdPut(
        mesaId: number,
        requestBody: MesaUpdate,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mesas/admin/mesas/{mesa_id}',
            path: {
                'mesa_id': mesaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Mesa
     * Deleta uma mesa
     * @param mesaId
     * @returns void
     * @throws ApiError
     */
    public deletarMesaApiMesasAdminMesasMesaIdDelete(
        mesaId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mesas/admin/mesas/{mesa_id}',
            path: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Status Mesa
     * Atualiza apenas o status da mesa
     * @param mesaId
     * @param requestBody
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public atualizarStatusMesaApiMesasAdminMesasMesaIdStatusPatch(
        mesaId: number,
        requestBody: MesaStatusUpdate,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/mesas/admin/mesas/{mesa_id}/status',
            path: {
                'mesa_id': mesaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Ocupar Mesa
     * Ocupa uma mesa
     * @param mesaId
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public ocuparMesaApiMesasAdminMesasMesaIdOcuparPost(
        mesaId: number,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/mesas/{mesa_id}/ocupar',
            path: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Liberar Mesa
     * Libera uma mesa
     * @param mesaId
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public liberarMesaApiMesasAdminMesasMesaIdLiberarPost(
        mesaId: number,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/mesas/{mesa_id}/liberar',
            path: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reservar Mesa
     * Reserva uma mesa
     * @param mesaId
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public reservarMesaApiMesasAdminMesasMesaIdReservarPost(
        mesaId: number,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/mesas/{mesa_id}/reservar',
            path: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter Historico Mesa
     * Obtém o histórico completo de operações de uma mesa.
     *
     * - **mesa_id**: ID da mesa (obrigatório, deve ser maior que 0)
     *
     * Retorna todos os registros de operações com timestamps, descrições e observações.
     * @param mesaId ID da mesa
     * @returns HistoricoDaMesaResponse Successful Response
     * @throws ApiError
     */
    public obterHistoricoMesaApiMesasAdminMesasMesaIdHistoricoGet(
        mesaId: number,
    ): CancelablePromise<HistoricoDaMesaResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/mesas/{mesa_id}/historico',
            path: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
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
