/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSubscriptionRequest } from '../models/CreateSubscriptionRequest';
import type { SubscriptionListResponse } from '../models/SubscriptionListResponse';
import type { SubscriptionResponse } from '../models/SubscriptionResponse';
import type { UpdateSubscriptionRequest } from '../models/UpdateSubscriptionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SubscriptionsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
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
}
