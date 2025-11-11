/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MercadoPagoWebhookPayload } from '../models/MercadoPagoWebhookPayload';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicDeliveryMercadoPagoWebhooksService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Mercadopago Webhook Healthcheck
     * Endpoint simples para verificação do Mercado Pago.
     * @returns string Successful Response
     * @throws ApiError
     */
    public mercadopagoWebhookHealthcheckApiCardapioPublicWebhooksPagamentosMercadopagoGet(): CancelablePromise<Record<string, string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/public/webhooks/pagamentos/mercadopago',
        });
    }
    /**
     * Mercadopago Webhook
     * @param id
     * @param topic
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public mercadopagoWebhookApiCardapioPublicWebhooksPagamentosMercadopagoPost(
        id?: (string | null),
        topic?: (string | null),
        requestBody?: (MercadoPagoWebhookPayload | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/public/webhooks/pagamentos/mercadopago',
            query: {
                'id': id,
                'topic': topic,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
