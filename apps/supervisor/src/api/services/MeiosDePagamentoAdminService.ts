/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MeioPagamentoCreate } from '../models/MeioPagamentoCreate';
import type { MeioPagamentoResponse } from '../models/MeioPagamentoResponse';
import type { MeioPagamentoUpdate } from '../models/MeioPagamentoUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MeiosDePagamentoAdminService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Meios Pagamento Admin
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public listarMeiosPagamentoAdminApiDeliveryMeiosPagamentoAdminGet(): CancelablePromise<Array<MeioPagamentoResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/meios-pagamento/admin/',
        });
    }
    /**
     * Criar Meio Pagamento
     * @param requestBody
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public criarMeioPagamentoApiDeliveryMeiosPagamentoAdminPost(
        requestBody: MeioPagamentoCreate,
    ): CancelablePromise<MeioPagamentoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/meios-pagamento/admin/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter Meio Pagamento
     * @param meioPagamentoId
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public obterMeioPagamentoApiDeliveryMeiosPagamentoAdminMeioPagamentoIdGet(
        meioPagamentoId: number,
    ): CancelablePromise<MeioPagamentoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/meios-pagamento/admin/{meio_pagamento_id}',
            path: {
                'meio_pagamento_id': meioPagamentoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Meio Pagamento
     * @param meioPagamentoId
     * @param requestBody
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public atualizarMeioPagamentoApiDeliveryMeiosPagamentoAdminMeioPagamentoIdPut(
        meioPagamentoId: number,
        requestBody: MeioPagamentoUpdate,
    ): CancelablePromise<MeioPagamentoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/meios-pagamento/admin/{meio_pagamento_id}',
            path: {
                'meio_pagamento_id': meioPagamentoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Meio Pagamento
     * @param meioPagamentoId
     * @returns any Successful Response
     * @throws ApiError
     */
    public deletarMeioPagamentoApiDeliveryMeiosPagamentoAdminMeioPagamentoIdDelete(
        meioPagamentoId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/meios-pagamento/admin/{meio_pagamento_id}',
            path: {
                'meio_pagamento_id': meioPagamentoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
