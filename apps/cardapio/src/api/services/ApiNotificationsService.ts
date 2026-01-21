/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_notificar_novo_pedido_api_notifications_pedidos_novo_pedido_post } from '../models/Body_notificar_novo_pedido_api_notifications_pedidos_novo_pedido_post';
import type { Body_publish_pedido_criado_api_notifications_events_pedido_criado_post } from '../models/Body_publish_pedido_criado_api_notifications_events_pedido_criado_post';
import type { Body_registrar_auditoria_api_notifications_historico_auditoria_post } from '../models/Body_registrar_auditoria_api_notifications_historico_auditoria_post';
import type { Body_send_bulk_notifications_rabbitmq_api_notifications_rabbitmq_send_bulk_notifications_post } from '../models/Body_send_bulk_notifications_rabbitmq_api_notifications_rabbitmq_send_bulk_notifications_post';
import type { CreateEventRequest } from '../models/CreateEventRequest';
import type { CreateNotificationRequest } from '../models/CreateNotificationRequest';
import type { CreateSubscriptionRequest } from '../models/CreateSubscriptionRequest';
import type { EventListResponse } from '../models/EventListResponse';
import type { EventResponse } from '../models/EventResponse';
import type { NotificationListResponse } from '../models/NotificationListResponse';
import type { NotificationLogResponse } from '../models/NotificationLogResponse';
import type { NotificationResponse } from '../models/NotificationResponse';
import type { SendNotificationRequest } from '../models/SendNotificationRequest';
import type { SubscriptionListResponse } from '../models/SubscriptionListResponse';
import type { SubscriptionResponse } from '../models/SubscriptionResponse';
import type { UpdateSubscriptionRequest } from '../models/UpdateSubscriptionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ApiNotificationsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Notification
     * Cria uma nova notificação
     * @param requestBody
     * @returns NotificationResponse Successful Response
     * @throws ApiError
     */
    public createNotificationApiNotificationsNotificationsPost(
        requestBody: CreateNotificationRequest,
    ): CancelablePromise<NotificationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/notifications/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Notifications
     * Lista notificações com filtros
     * @param empresaId ID da empresa
     * @param userId ID do usuário
     * @param eventType Tipo do evento
     * @param channel Canal de notificação
     * @param status Status da notificação
     * @param priority Prioridade
     * @param page Página
     * @param perPage Itens por página
     * @returns NotificationListResponse Successful Response
     * @throws ApiError
     */
    public listNotificationsApiNotificationsNotificationsGet(
        empresaId?: (string | null),
        userId?: (string | null),
        eventType?: (string | null),
        channel?: (string | null),
        status?: (string | null),
        priority?: (string | null),
        page: number = 1,
        perPage: number = 50,
    ): CancelablePromise<NotificationListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/notifications/',
            query: {
                'empresa_id': empresaId,
                'user_id': userId,
                'event_type': eventType,
                'channel': channel,
                'status': status,
                'priority': priority,
                'page': page,
                'per_page': perPage,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Send Notification
     * Envia notificação para múltiplos canais
     * @param requestBody
     * @returns string Successful Response
     * @throws ApiError
     */
    public sendNotificationApiNotificationsNotificationsSendPost(
        requestBody: SendNotificationRequest,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/notifications/send',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Notification
     * Busca notificação por ID
     * @param notificationId
     * @returns NotificationResponse Successful Response
     * @throws ApiError
     */
    public getNotificationApiNotificationsNotificationsNotificationIdGet(
        notificationId: string,
    ): CancelablePromise<NotificationResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/notifications/{notification_id}',
            path: {
                'notification_id': notificationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Notification Logs
     * Busca logs de uma notificação
     * @param notificationId
     * @returns NotificationLogResponse Successful Response
     * @throws ApiError
     */
    public getNotificationLogsApiNotificationsNotificationsNotificationIdLogsGet(
        notificationId: string,
    ): CancelablePromise<Array<NotificationLogResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/notifications/{notification_id}/logs',
            path: {
                'notification_id': notificationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Process Pending Notifications
     * Processa notificações pendentes em background
     * @param limit Limite de notificações para processar
     * @returns any Successful Response
     * @throws ApiError
     */
    public processPendingNotificationsApiNotificationsNotificationsProcessPendingPost(
        limit: number = 50,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/notifications/process-pending',
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Retry Failed Notifications
     * Tenta reenviar notificações que falharam
     * @param limit Limite de notificações para reprocessar
     * @returns any Successful Response
     * @throws ApiError
     */
    public retryFailedNotificationsApiNotificationsNotificationsRetryFailedPost(
        limit: number = 50,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/notifications/retry-failed',
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Subscription
     * Cria uma nova assinatura de notificação
     * @param requestBody
     * @returns SubscriptionResponse Successful Response
     * @throws ApiError
     */
    public createSubscriptionApiNotificationsSubscriptionsPost(
        requestBody: CreateSubscriptionRequest,
    ): CancelablePromise<SubscriptionResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/subscriptions/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Subscriptions
     * Lista assinaturas com filtros
     * @param empresaId ID da empresa
     * @param userId ID do usuário
     * @param eventType Tipo do evento
     * @param channel Canal de notificação
     * @param active Status ativo
     * @param page Página
     * @param perPage Itens por página
     * @returns SubscriptionListResponse Successful Response
     * @throws ApiError
     */
    public listSubscriptionsApiNotificationsSubscriptionsGet(
        empresaId?: (string | null),
        userId?: (string | null),
        eventType?: (string | null),
        channel?: (string | null),
        active?: (boolean | null),
        page: number = 1,
        perPage: number = 50,
    ): CancelablePromise<SubscriptionListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/subscriptions/',
            query: {
                'empresa_id': empresaId,
                'user_id': userId,
                'event_type': eventType,
                'channel': channel,
                'active': active,
                'page': page,
                'per_page': perPage,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Subscription
     * Busca assinatura por ID
     * @param subscriptionId
     * @returns SubscriptionResponse Successful Response
     * @throws ApiError
     */
    public getSubscriptionApiNotificationsSubscriptionsSubscriptionIdGet(
        subscriptionId: string,
    ): CancelablePromise<SubscriptionResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/subscriptions/{subscription_id}',
            path: {
                'subscription_id': subscriptionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Subscription
     * Atualiza uma assinatura
     * @param subscriptionId
     * @param requestBody
     * @returns SubscriptionResponse Successful Response
     * @throws ApiError
     */
    public updateSubscriptionApiNotificationsSubscriptionsSubscriptionIdPut(
        subscriptionId: string,
        requestBody: UpdateSubscriptionRequest,
    ): CancelablePromise<SubscriptionResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/notifications/subscriptions/{subscription_id}',
            path: {
                'subscription_id': subscriptionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Subscription
     * Remove uma assinatura
     * @param subscriptionId
     * @returns any Successful Response
     * @throws ApiError
     */
    public deleteSubscriptionApiNotificationsSubscriptionsSubscriptionIdDelete(
        subscriptionId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/notifications/subscriptions/{subscription_id}',
            path: {
                'subscription_id': subscriptionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Toggle Subscription
     * Ativa/desativa uma assinatura
     * @param subscriptionId
     * @returns any Successful Response
     * @throws ApiError
     */
    public toggleSubscriptionApiNotificationsSubscriptionsSubscriptionIdTogglePost(
        subscriptionId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/subscriptions/{subscription_id}/toggle',
            path: {
                'subscription_id': subscriptionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Empresa Subscriptions
     * Busca assinaturas de uma empresa
     * @param empresaId
     * @param limit Limite de resultados
     * @param offset Offset
     * @returns SubscriptionResponse Successful Response
     * @throws ApiError
     */
    public getEmpresaSubscriptionsApiNotificationsSubscriptionsEmpresaEmpresaIdGet(
        empresaId: string,
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<SubscriptionResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/subscriptions/empresa/{empresa_id}',
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
     * Get User Subscriptions
     * Busca assinaturas de um usuário
     * @param userId
     * @param limit Limite de resultados
     * @param offset Offset
     * @returns SubscriptionResponse Successful Response
     * @throws ApiError
     */
    public getUserSubscriptionsApiNotificationsSubscriptionsUserUserIdGet(
        userId: string,
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<SubscriptionResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/subscriptions/user/{user_id}',
            path: {
                'user_id': userId,
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
     * Get Supported Channels
     * Retorna lista de canais suportados
     * @returns any Successful Response
     * @throws ApiError
     */
    public getSupportedChannelsApiNotificationsSubscriptionsChannelsSupportedGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/subscriptions/channels/supported',
        });
    }
    /**
     * Test Channel Config
     * Testa configuração de um canal
     * @param channel
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public testChannelConfigApiNotificationsSubscriptionsChannelsTestPost(
        channel: string,
        requestBody: Record<string, any>,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/subscriptions/channels/test',
            query: {
                'channel': channel,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Subscription Statistics
     * Retorna estatísticas de assinaturas de uma empresa
     * @param empresaId
     * @returns any Successful Response
     * @throws ApiError
     */
    public getSubscriptionStatisticsApiNotificationsSubscriptionsStatisticsEmpresaIdGet(
        empresaId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/subscriptions/statistics/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
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
    /**
     * Notificar Novo Pedido
     * Notifica sobre um novo pedido criado
     *
     * Este endpoint deve ser chamado sempre que um novo pedido for criado no sistema.
     * Ele irá:
     * 1. Publicar um evento no sistema de eventos
     * 2. Processar assinaturas de notificação configuradas
     * @param empresaId
     * @param pedidoId
     * @param valorTotal
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public notificarNovoPedidoApiNotificationsPedidosNovoPedidoPost(
        empresaId: string,
        pedidoId: string,
        valorTotal: number,
        formData: Body_notificar_novo_pedido_api_notifications_pedidos_novo_pedido_post,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/pedidos/novo-pedido',
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
     * Notificar Pedido Aprovado
     * Notifica sobre pedido aprovado
     * @param empresaId
     * @param pedidoId
     * @param aprovadoPor
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public notificarPedidoAprovadoApiNotificationsPedidosPedidoAprovadoPost(
        empresaId: string,
        pedidoId: string,
        aprovadoPor: string,
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/pedidos/pedido-aprovado',
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
     * Notificar Pedido Cancelado
     * Notifica sobre pedido cancelado
     * @param empresaId
     * @param pedidoId
     * @param motivo
     * @param canceladoPor
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public notificarPedidoCanceladoApiNotificationsPedidosPedidoCanceladoPost(
        empresaId: string,
        pedidoId: string,
        motivo: string,
        canceladoPor: string,
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/pedidos/pedido-cancelado',
            query: {
                'empresa_id': empresaId,
                'pedido_id': pedidoId,
                'motivo': motivo,
                'cancelado_por': canceladoPor,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Notificar Pedido Entregue
     * Notifica sobre pedido entregue
     * @param empresaId
     * @param pedidoId
     * @param entreguePor
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public notificarPedidoEntregueApiNotificationsPedidosPedidoEntreguePost(
        empresaId: string,
        pedidoId: string,
        entreguePor: string,
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/pedidos/pedido-entregue',
            query: {
                'empresa_id': empresaId,
                'pedido_id': pedidoId,
                'entregue_por': entreguePor,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Registrar Mudanca Status Pedido
     * Registra mudança de status de pedido no histórico
     * @param empresaId
     * @param pedidoId
     * @param statusAnterior
     * @param statusNovo
     * @param usuarioId
     * @param motivo
     * @returns any Successful Response
     * @throws ApiError
     */
    public registrarMudancaStatusPedidoApiNotificationsHistoricoPedidoStatusChangePost(
        empresaId: string,
        pedidoId: string,
        statusAnterior: string,
        statusNovo: string,
        usuarioId: string,
        motivo?: (string | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/historico/pedido/status-change',
            query: {
                'empresa_id': empresaId,
                'pedido_id': pedidoId,
                'status_anterior': statusAnterior,
                'status_novo': statusNovo,
                'usuario_id': usuarioId,
                'motivo': motivo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Registrar Login Usuario
     * Registra login de usuário no histórico
     * @param empresaId
     * @param userId
     * @param ipAddress
     * @param userAgent
     * @returns any Successful Response
     * @throws ApiError
     */
    public registrarLoginUsuarioApiNotificationsHistoricoUsuarioLoginPost(
        empresaId: string,
        userId: string,
        ipAddress?: (string | null),
        userAgent?: (string | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/historico/usuario/login',
            query: {
                'empresa_id': empresaId,
                'user_id': userId,
                'ip_address': ipAddress,
                'user_agent': userAgent,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Registrar Logout Usuario
     * Registra logout de usuário no histórico
     * @param empresaId
     * @param userId
     * @param sessionDuration
     * @returns any Successful Response
     * @throws ApiError
     */
    public registrarLogoutUsuarioApiNotificationsHistoricoUsuarioLogoutPost(
        empresaId: string,
        userId: string,
        sessionDuration?: (number | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/historico/usuario/logout',
            query: {
                'empresa_id': empresaId,
                'user_id': userId,
                'session_duration': sessionDuration,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Registrar Log Sistema
     * Registra log do sistema no histórico
     * @param empresaId
     * @param modulo
     * @param nivel
     * @param mensagem
     * @param erro
     * @param stackTrace
     * @returns any Successful Response
     * @throws ApiError
     */
    public registrarLogSistemaApiNotificationsHistoricoSistemaLogPost(
        empresaId: string,
        modulo: string,
        nivel: string,
        mensagem: string,
        erro?: (string | null),
        stackTrace?: (string | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/historico/sistema/log',
            query: {
                'empresa_id': empresaId,
                'modulo': modulo,
                'nivel': nivel,
                'mensagem': mensagem,
                'erro': erro,
                'stack_trace': stackTrace,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Registrar Auditoria
     * Registra evento de auditoria no histórico
     * @param empresaId
     * @param usuarioId
     * @param acao
     * @param recurso
     * @param recursoId
     * @param ipAddress
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public registrarAuditoriaApiNotificationsHistoricoAuditoriaPost(
        empresaId: string,
        usuarioId: string,
        acao: string,
        recurso: string,
        recursoId: string,
        ipAddress?: (string | null),
        requestBody?: Body_registrar_auditoria_api_notifications_historico_auditoria_post,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/historico/auditoria',
            query: {
                'empresa_id': empresaId,
                'usuario_id': usuarioId,
                'acao': acao,
                'recurso': recurso,
                'recurso_id': recursoId,
                'ip_address': ipAddress,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Historico Empresa
     * Busca histórico completo da empresa
     * @param empresaId
     * @param dataInicio Data de início (ISO format)
     * @param dataFim Data de fim (ISO format)
     * @param tiposEvento Tipos de evento para filtrar
     * @param limit Limite de resultados
     * @param offset Offset para paginação
     * @returns any Successful Response
     * @throws ApiError
     */
    public getHistoricoEmpresaApiNotificationsHistoricoEmpresaEmpresaIdGet(
        empresaId: string,
        dataInicio?: (string | null),
        dataFim?: (string | null),
        tiposEvento?: (Array<string> | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/historico/empresa/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            query: {
                'data_inicio': dataInicio,
                'data_fim': dataFim,
                'tipos_evento': tiposEvento,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Historico Pedido
     * Busca histórico completo de um pedido
     * @param pedidoId
     * @param empresaId
     * @returns any Successful Response
     * @throws ApiError
     */
    public getHistoricoPedidoApiNotificationsHistoricoPedidoPedidoIdGet(
        pedidoId: string,
        empresaId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/historico/pedido/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            query: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Historico Usuario
     * Busca histórico completo de um usuário
     * @param userId
     * @param empresaId
     * @param dataInicio Data de início (ISO format)
     * @param dataFim Data de fim (ISO format)
     * @returns any Successful Response
     * @throws ApiError
     */
    public getHistoricoUsuarioApiNotificationsHistoricoUsuarioUserIdGet(
        userId: string,
        empresaId: string,
        dataInicio?: (string | null),
        dataFim?: (string | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/historico/usuario/{user_id}',
            path: {
                'user_id': userId,
            },
            query: {
                'empresa_id': empresaId,
                'data_inicio': dataInicio,
                'data_fim': dataFim,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Estatisticas Empresa
     * Busca estatísticas da empresa
     * @param empresaId
     * @param dataInicio Data de início (ISO format)
     * @param dataFim Data de fim (ISO format)
     * @returns any Successful Response
     * @throws ApiError
     */
    public getEstatisticasEmpresaApiNotificationsHistoricoEstatisticasEmpresaIdGet(
        empresaId: string,
        dataInicio?: (string | null),
        dataFim?: (string | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/historico/estatisticas/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            query: {
                'data_inicio': dataInicio,
                'data_fim': dataFim,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Dashboard Empresa
     * Busca dados para dashboard da empresa
     * @param empresaId
     * @param periodoDias Período em dias
     * @returns any Successful Response
     * @throws ApiError
     */
    public getDashboardEmpresaApiNotificationsHistoricoDashboardEmpresaIdGet(
        empresaId: string,
        periodoDias: number = 30,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/historico/dashboard/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            query: {
                'periodo_dias': periodoDias,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Executar Migracao Historicos
     * Executa migração de dados antigos para o sistema unificado
     * @param removerAntigas Remove tabelas antigas após migração
     * @returns any Successful Response
     * @throws ApiError
     */
    public executarMigracaoHistoricosApiNotificationsHistoricoMigrarPost(
        removerAntigas: boolean = false,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/historico/migrar',
            query: {
                'remover_antigas': removerAntigas,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Status Migracao
     * Verifica status da migração
     * @returns any Successful Response
     * @throws ApiError
     */
    public statusMigracaoApiNotificationsHistoricoMigracaoStatusGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/historico/migracao/status',
        });
    }
    /**
     * Get Rabbitmq Status
     * Retorna status do RabbitMQ
     * @returns any Successful Response
     * @throws ApiError
     */
    public getRabbitmqStatusApiNotificationsRabbitmqStatusGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/rabbitmq/status',
        });
    }
    /**
     * Send Notification Rabbitmq
     * Envia notificação via RabbitMQ
     * @param empresaId
     * @param userId
     * @param eventType
     * @param title
     * @param message
     * @param channel
     * @param recipient
     * @param priority
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public sendNotificationRabbitmqApiNotificationsRabbitmqSendNotificationPost(
        empresaId: string,
        userId: (string | null),
        eventType: string,
        title: string,
        message: string,
        channel: string,
        recipient: string,
        priority: string = 'normal',
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/rabbitmq/send-notification',
            query: {
                'empresa_id': empresaId,
                'user_id': userId,
                'event_type': eventType,
                'title': title,
                'message': message,
                'channel': channel,
                'recipient': recipient,
                'priority': priority,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Send Bulk Notifications Rabbitmq
     * Envia notificações em lote via RabbitMQ
     * @param empresaId
     * @param eventType
     * @param title
     * @param message
     * @param requestBody
     * @param priority
     * @returns any Successful Response
     * @throws ApiError
     */
    public sendBulkNotificationsRabbitmqApiNotificationsRabbitmqSendBulkNotificationsPost(
        empresaId: string,
        eventType: string,
        title: string,
        message: string,
        requestBody: Body_send_bulk_notifications_rabbitmq_api_notifications_rabbitmq_send_bulk_notifications_post,
        priority: string = 'normal',
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/rabbitmq/send-bulk-notifications',
            query: {
                'empresa_id': empresaId,
                'event_type': eventType,
                'title': title,
                'message': message,
                'priority': priority,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Notification Status
     * Busca status de uma notificação
     * @param notificationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public getNotificationStatusApiNotificationsRabbitmqNotificationNotificationIdStatusGet(
        notificationId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/rabbitmq/notification/{notification_id}/status',
            path: {
                'notification_id': notificationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Retry Failed Notifications
     * Tenta reenviar notificações que falharam via RabbitMQ
     * @param limit Limite de notificações para reprocessar
     * @returns any Successful Response
     * @throws ApiError
     */
    public retryFailedNotificationsApiNotificationsRabbitmqRetryFailedPost(
        limit: number = 50,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/rabbitmq/retry-failed',
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Rabbitmq Queues
     * Lista queues do RabbitMQ
     * @returns any Successful Response
     * @throws ApiError
     */
    public getRabbitmqQueuesApiNotificationsRabbitmqQueuesGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/rabbitmq/queues',
        });
    }
    /**
     * Test Rabbitmq Connection
     * Testa conexão com RabbitMQ
     * @returns any Successful Response
     * @throws ApiError
     */
    public testRabbitmqConnectionApiNotificationsRabbitmqTestConnectionPost(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/rabbitmq/test-connection',
        });
    }
}
