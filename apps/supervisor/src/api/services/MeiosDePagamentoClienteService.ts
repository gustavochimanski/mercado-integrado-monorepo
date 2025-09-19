/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MeioPagamentoResponse } from '../models/MeioPagamentoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MeiosDePagamentoClienteService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Meios Pagamento
     * @param xSuperToken
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public listarMeiosPagamentoApiDeliveryClienteMeiosPagamentoGet(
        xSuperToken: string,
    ): CancelablePromise<Array<MeioPagamentoResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/cliente/meios-pagamento/',
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
