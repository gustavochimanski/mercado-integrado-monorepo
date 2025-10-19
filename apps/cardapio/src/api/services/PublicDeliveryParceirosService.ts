/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BannerParceiroOut } from '../models/BannerParceiroOut';
import type { ParceiroCompletoOut } from '../models/ParceiroCompletoOut';
import type { ParceiroOut } from '../models/ParceiroOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicDeliveryParceirosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Parceiros
     * Lista todos os parceiros (endpoint público)
     * @returns ParceiroOut Successful Response
     * @throws ApiError
     */
    public listParceirosApiDeliveryPublicParceirosGet(): CancelablePromise<Array<ParceiroOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/public/parceiros/',
        });
    }
    /**
     * List Banners
     * Lista banners para clientes (endpoint público)
     * @param parceiroId
     * @returns BannerParceiroOut Successful Response
     * @throws ApiError
     */
    public listBannersApiDeliveryPublicParceirosBannersGet(
        parceiroId?: (number | null),
    ): CancelablePromise<Array<BannerParceiroOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/public/parceiros/banners',
            query: {
                'parceiro_id': parceiroId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Parceiro Completo
     * Retorna parceiro completo com banners e cupons (endpoint público)
     * @param parceiroId
     * @returns ParceiroCompletoOut Successful Response
     * @throws ApiError
     */
    public getParceiroCompletoApiDeliveryPublicParceirosParceiroIdFullGet(
        parceiroId: number,
    ): CancelablePromise<ParceiroCompletoOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/public/parceiros/{parceiro_id}/full',
            path: {
                'parceiro_id': parceiroId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
