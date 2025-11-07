/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_publish_pedido_criado_api_notifications_events_pedido_criado_post } from '../models/Body_publish_pedido_criado_api_notifications_events_pedido_criado_post';
import type { CreateEventRequest } from '../models/CreateEventRequest';
import type { EventListResponse } from '../models/EventListResponse';
import type { EventResponse } from '../models/EventResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class EventsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Event
     * Cria um novo evento
     * @param requestBody
     * @returns EventResponse Successful Response
     * @throws ApiError
     */
    public createEventApiNotificationsEventsPost(
        requestBody: CreateEventRequest,
    ): CancelablePromise<EventResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/events/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Events
     * Lista eventos com filtros
     * @param empresaId ID da empresa
     * @param eventType Tipo do evento
     * @param processed Status de processamento
     * @param page Página
     * @param perPage Itens por página
     * @returns EventListResponse Successful Response
     * @throws ApiError
     */
    public listEventsApiNotificationsEventsGet(
        empresaId?: (string | null),
        eventType?: (string | null),
        processed?: (boolean | null),
        page: number = 1,
        perPage: number = 50,
    ): CancelablePromise<EventListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/events/',
            query: {
                'empresa_id': empresaId,
                'event_type': eventType,
                'processed': processed,
                'page': page,
                'per_page': perPage,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Publish Pedido Criado
     * Publica evento de pedido criado
     * @param empresaId
     * @param pedidoId
     * @param valorTotal
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public publishPedidoCriadoApiNotificationsEventsPedidoCriadoPost(
        empresaId: string,
        pedidoId: string,
        valorTotal: number,
        formData: Body_publish_pedido_criado_api_notifications_events_pedido_criado_post,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/events/pedido-criado',
            query: {
                'empresa_id': empresaId,
                'pedido_id': pedidoId,
                'valor_total': valorTotal,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Publish Pedido Aprovado
     * Publica evento de pedido aprovado
     * @param empresaId
     * @param pedidoId
     * @param aprovadoPor
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public publishPedidoAprovadoApiNotificationsEventsPedidoAprovadoPost(
        empresaId: string,
        pedidoId: string,
        aprovadoPor: string,
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/events/pedido-aprovado',
            query: {
                'empresa_id': empresaId,
                'pedido_id': pedidoId,
                'aprovado_por': aprovadoPor,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Publish Estoque Baixo
     * Publica evento de estoque baixo
     * @param empresaId
     * @param produtoId
     * @param produtoNome
     * @param quantidadeAtual
     * @param quantidadeMinima
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public publishEstoqueBaixoApiNotificationsEventsEstoqueBaixoPost(
        empresaId: string,
        produtoId: string,
        produtoNome: string,
        quantidadeAtual: number,
        quantidadeMinima: number,
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/events/estoque-baixo',
            query: {
                'empresa_id': empresaId,
                'produto_id': produtoId,
                'produto_nome': produtoNome,
                'quantidade_atual': quantidadeAtual,
                'quantidade_minima': quantidadeMinima,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Publish Pagamento Aprovado
     * Publica evento de pagamento aprovado
     * @param empresaId
     * @param pagamentoId
     * @param pedidoId
     * @param valor
     * @param metodoPagamento
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public publishPagamentoAprovadoApiNotificationsEventsPagamentoAprovadoPost(
        empresaId: string,
        pagamentoId: string,
        pedidoId: string,
        valor: number,
        metodoPagamento: string,
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/events/pagamento-aprovado',
            query: {
                'empresa_id': empresaId,
                'pagamento_id': pagamentoId,
                'pedido_id': pedidoId,
                'valor': valor,
                'metodo_pagamento': metodoPagamento,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Event
     * Busca evento por ID
     * @param eventId
     * @returns EventResponse Successful Response
     * @throws ApiError
     */
    public getEventApiNotificationsEventsEventIdGet(
        eventId: string,
    ): CancelablePromise<EventResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/events/{event_id}',
            path: {
                'event_id': eventId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Empresa Events
     * Busca eventos de uma empresa
     * @param empresaId
     * @param limit Limite de resultados
     * @param offset Offset
     * @returns EventResponse Successful Response
     * @throws ApiError
     */
    public getEmpresaEventsApiNotificationsEventsEmpresaEmpresaIdGet(
        empresaId: string,
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<EventResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/events/empresa/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Event Statistics
     * Retorna estatísticas de eventos de uma empresa
     * @param empresaId
     * @param days Período em dias
     * @returns any Successful Response
     * @throws ApiError
     */
    public getEventStatisticsApiNotificationsEventsStatisticsEmpresaIdGet(
        empresaId: string,
        days: number = 30,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/events/statistics/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            query: {
                'days': days,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
