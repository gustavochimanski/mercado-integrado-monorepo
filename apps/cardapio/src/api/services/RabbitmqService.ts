/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_send_bulk_notifications_rabbitmq_api_notifications_rabbitmq_send_bulk_notifications_post } from '../models/Body_send_bulk_notifications_rabbitmq_api_notifications_rabbitmq_send_bulk_notifications_post';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class RabbitmqService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
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
