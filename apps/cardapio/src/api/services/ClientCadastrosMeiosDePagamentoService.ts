/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MeioPagamentoResponse } from '../models/MeioPagamentoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClientCadastrosMeiosDePagamentoService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Meios Pagamento
     * @param xSuperToken
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public listarMeiosPagamentoApiCadastrosClientMeiosPagamentoGet(
        xSuperToken: string,
    ): CancelablePromise<Array<MeioPagamentoResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/client/meios-pagamento/',
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
