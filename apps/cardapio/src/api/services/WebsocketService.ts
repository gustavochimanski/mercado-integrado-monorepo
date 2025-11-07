/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class WebsocketService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get Connection Stats
     * Retorna estatísticas das conexões WebSocket
     * @returns any Successful Response
     * @throws ApiError
     */
    public getConnectionStatsApiNotificationsWsConnectionsStatsGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/ws/connections/stats',
        });
    }
    /**
     * Send Notification To User
     * Envia notificação para um usuário específico via WebSocket
     * @param userId
     * @param title
     * @param message
     * @param notificationType
     * @returns any Successful Response
     * @throws ApiError
     */
    public sendNotificationToUserApiNotificationsWsNotificationsSendPost(
        userId: string,
        title: string,
        message: string,
        notificationType: string = 'info',
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/ws/notifications/send',
            query: {
                'user_id': userId,
                'title': title,
                'message': message,
                'notification_type': notificationType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Broadcast Notification
     * Envia notificação para todos os usuários de uma empresa
     * @param empresaId
     * @param title
     * @param message
     * @param notificationType
     * @returns any Successful Response
     * @throws ApiError
     */
    public broadcastNotificationApiNotificationsWsNotificationsBroadcastPost(
        empresaId: string,
        title: string,
        message: string,
        notificationType: string = 'info',
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/ws/notifications/broadcast',
            query: {
                'empresa_id': empresaId,
                'title': title,
                'message': message,
                'notification_type': notificationType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
