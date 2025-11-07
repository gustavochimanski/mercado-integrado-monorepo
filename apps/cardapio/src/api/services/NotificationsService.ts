/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateNotificationRequest } from '../models/CreateNotificationRequest';
import type { NotificationListResponse } from '../models/NotificationListResponse';
import type { NotificationLogResponse } from '../models/NotificationLogResponse';
import type { NotificationResponse } from '../models/NotificationResponse';
import type { SendNotificationRequest } from '../models/SendNotificationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class NotificationsService {
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
}
