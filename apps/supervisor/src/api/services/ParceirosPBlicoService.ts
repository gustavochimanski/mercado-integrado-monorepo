/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BannerParceiroIn } from '../models/BannerParceiroIn';
import type { BannerParceiroOut } from '../models/BannerParceiroOut';
import type { Body_create_banner_api_delivery_banners_post } from '../models/Body_create_banner_api_delivery_banners_post';
import type { ParceiroCompletoOut } from '../models/ParceiroCompletoOut';
import type { ParceiroIn } from '../models/ParceiroIn';
import type { ParceiroOut } from '../models/ParceiroOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ParceirosPBlicoService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Parceiros
     * @returns ParceiroOut Successful Response
     * @throws ApiError
     */
    public listParceirosApiDeliveryParceirosGet(): CancelablePromise<Array<ParceiroOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/parceiros',
        });
    }
    /**
     * Create Parceiro
     * @param requestBody
     * @returns ParceiroOut Successful Response
     * @throws ApiError
     */
    public createParceiroApiDeliveryParceirosPost(
        requestBody: ParceiroIn,
    ): CancelablePromise<ParceiroOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/parceiros',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Parceiro
     * @param parceiroId
     * @param requestBody
     * @returns ParceiroOut Successful Response
     * @throws ApiError
     */
    public updateParceiroApiDeliveryParceirosParceiroIdPut(
        parceiroId: number,
        requestBody: ParceiroIn,
    ): CancelablePromise<ParceiroOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/parceiros/{parceiro_id}',
            path: {
                'parceiro_id': parceiroId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Parceiro
     * @param parceiroId
     * @returns void
     * @throws ApiError
     */
    public deleteParceiroApiDeliveryParceirosParceiroIdDelete(
        parceiroId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/parceiros/{parceiro_id}',
            path: {
                'parceiro_id': parceiroId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Banner
     * @param formData
     * @returns BannerParceiroOut Successful Response
     * @throws ApiError
     */
    public createBannerApiDeliveryBannersPost(
        formData: Body_create_banner_api_delivery_banners_post,
    ): CancelablePromise<BannerParceiroOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/banners',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Banners
     * @param parceiroId
     * @returns BannerParceiroOut Successful Response
     * @throws ApiError
     */
    public listBannersApiDeliveryClientBannersGet(
        parceiroId?: (number | null),
    ): CancelablePromise<Array<BannerParceiroOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/client/banners',
            query: {
                'parceiro_id': parceiroId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Banner
     * @param bannerId
     * @param requestBody
     * @returns BannerParceiroOut Successful Response
     * @throws ApiError
     */
    public updateBannerApiDeliveryBannersBannerIdPut(
        bannerId: number,
        requestBody: BannerParceiroIn,
    ): CancelablePromise<BannerParceiroOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/banners/{banner_id}',
            path: {
                'banner_id': bannerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Banner
     * @param bannerId
     * @returns void
     * @throws ApiError
     */
    public deleteBannerApiDeliveryBannersBannerIdDelete(
        bannerId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/banners/{banner_id}',
            path: {
                'banner_id': bannerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Parceiro Completo
     * @param parceiroId
     * @returns ParceiroCompletoOut Successful Response
     * @throws ApiError
     */
    public getParceiroCompletoApiDeliveryParceirosParceiroIdFullGet(
        parceiroId: number,
    ): CancelablePromise<ParceiroCompletoOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/parceiros/{parceiro_id}/full',
            path: {
                'parceiro_id': parceiroId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
