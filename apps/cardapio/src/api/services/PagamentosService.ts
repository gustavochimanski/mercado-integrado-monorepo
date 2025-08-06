/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PagamentoRequest } from '../models/PagamentoRequest';
import type { PagamentoResponse } from '../models/PagamentoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PagamentosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Criar Pagamento
     * @param requestBody
     * @returns PagamentoResponse Successful Response
     * @throws ApiError
     */
    public criarPagamentoPagarmePagamentosPost(
        requestBody: PagamentoRequest,
    ): CancelablePromise<PagamentoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/pagarme/pagamentos/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Receber Webhook
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public receberWebhookPagarmePagamentosWebhookPost(
        requestBody: Record<string, any>,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/pagarme/pagamentos/webhook',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
