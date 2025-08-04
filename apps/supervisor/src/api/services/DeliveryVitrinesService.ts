/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CriarVitrineRequest } from '../models/CriarVitrineRequest';
import type { CriarVitrineResponse } from '../models/CriarVitrineResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DeliveryVitrinesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Vitrines
     * @param empresaId ID da empresa
     * @param codCategoria Filtrar por ID da categoria
     * @returns CriarVitrineResponse Successful Response
     * @throws ApiError
     */
    public listarVitrinesDeliveryVitrinesDeliveryGet(
        empresaId: number,
        codCategoria?: (number | null),
    ): CancelablePromise<Array<CriarVitrineResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/delivery/vitrines/delivery',
            query: {
                'empresa_id': empresaId,
                'cod_categoria': codCategoria,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Vitrines
     * @param requestBody
     * @returns CriarVitrineResponse Successful Response
     * @throws ApiError
     */
    public criarVitrinesDeliveryVitrinesDeliveryPost(
        requestBody: CriarVitrineRequest,
    ): CancelablePromise<CriarVitrineResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/delivery/vitrines/delivery',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Vitrine
     * @param subId
     * @returns void
     * @throws ApiError
     */
    public deletarVitrineDeliveryVitrinesDeliverySubIdDelete(
        subId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/delivery/vitrines/delivery/{sub_id}',
            path: {
                'sub_id': subId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
