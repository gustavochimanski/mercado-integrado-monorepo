/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_notificar_novo_pedido_api_notifications_pedidos_novo_pedido_post } from '../models/Body_notificar_novo_pedido_api_notifications_pedidos_novo_pedido_post';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PedidoNotificationsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Notificar Novo Pedido
     * Notifica sobre um novo pedido criado
     *
     * Este endpoint deve ser chamado sempre que um novo pedido for criado no sistema.
     * Ele irá:
     * 1. Publicar um evento no sistema de eventos
     * 2. Enviar notificação em tempo real via WebSocket para todos os usuários da empresa
     * 3. Processar assinaturas de notificação configuradas
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
}
