/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MeioPagamentoCreate } from '../models/MeioPagamentoCreate';
import type { MeioPagamentoResponse } from '../models/MeioPagamentoResponse';
import type { MeioPagamentoUpdate } from '../models/MeioPagamentoUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminDeliveryMeiosDePagamentoService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Meios Pagamento Admin
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public listarMeiosPagamentoAdminApiDeliveryAdminMeiosPagamentoGet(): CancelablePromise<Array<MeioPagamentoResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/admin/meios-pagamento/',
        });
    }
    /**
     * Criar Meio Pagamento
     * @param requestBody
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public criarMeioPagamentoApiDeliveryAdminMeiosPagamentoPost(
        requestBody: MeioPagamentoCreate,
    ): CancelablePromise<MeioPagamentoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/admin/meios-pagamento/',
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
    public obterMeioPagamentoApiDeliveryAdminMeiosPagamentoMeioPagamentoIdGet(
        meioPagamentoId: number,
    ): CancelablePromise<MeioPagamentoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/admin/meios-pagamento/{meio_pagamento_id}',
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
    public atualizarMeioPagamentoApiDeliveryAdminMeiosPagamentoMeioPagamentoIdPut(
        meioPagamentoId: number,
        requestBody: MeioPagamentoUpdate,
    ): CancelablePromise<MeioPagamentoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/admin/meios-pagamento/{meio_pagamento_id}',
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
    public deletarMeioPagamentoApiDeliveryAdminMeiosPagamentoMeioPagamentoIdDelete(
        meioPagamentoId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/admin/meios-pagamento/{meio_pagamento_id}',
            path: {
                'meio_pagamento_id': meioPagamentoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
