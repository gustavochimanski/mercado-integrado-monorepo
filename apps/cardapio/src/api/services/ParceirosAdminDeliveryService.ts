/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BannerParceiroIn } from '../models/BannerParceiroIn';
import type { BannerParceiroOut } from '../models/BannerParceiroOut';
import type { Body_create_banner_api_delivery_parceiros_admin_banners_post } from '../models/Body_create_banner_api_delivery_parceiros_admin_banners_post';
import type { ParceiroIn } from '../models/ParceiroIn';
import type { ParceiroOut } from '../models/ParceiroOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ParceirosAdminDeliveryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create Parceiro
     * Cria um novo parceiro (endpoint admin)
     * @param requestBody
     * @returns ParceiroOut Successful Response
     * @throws ApiError
     */
    public createParceiroApiDeliveryParceirosAdminPost(
        requestBody: ParceiroIn,
    ): CancelablePromise<ParceiroOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/parceiros/admin/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Parceiro
     * Atualiza um parceiro existente (endpoint admin)
     * @param parceiroId
     * @param requestBody
     * @returns ParceiroOut Successful Response
     * @throws ApiError
     */
    public updateParceiroApiDeliveryParceirosAdminParceiroIdPut(
        parceiroId: number,
        requestBody: ParceiroIn,
    ): CancelablePromise<ParceiroOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/parceiros/admin/{parceiro_id}',
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
     * Deleta um parceiro (endpoint admin)
     * @param parceiroId
     * @returns void
     * @throws ApiError
     */
    public deleteParceiroApiDeliveryParceirosAdminParceiroIdDelete(
        parceiroId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/parceiros/admin/{parceiro_id}',
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
     * Cria um novo banner para parceiro (endpoint admin)
     * @param formData
     * @returns BannerParceiroOut Successful Response
     * @throws ApiError
     */
    public createBannerApiDeliveryParceirosAdminBannersPost(
        formData: Body_create_banner_api_delivery_parceiros_admin_banners_post,
    ): CancelablePromise<BannerParceiroOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/parceiros/admin/banners',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Banner
     * Atualiza um banner existente (endpoint admin)
     * @param bannerId
     * @param requestBody
     * @returns BannerParceiroOut Successful Response
     * @throws ApiError
     */
    public updateBannerApiDeliveryParceirosAdminBannersBannerIdPut(
        bannerId: number,
        requestBody: BannerParceiroIn,
    ): CancelablePromise<BannerParceiroOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/parceiros/admin/banners/{banner_id}',
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
     * Deleta um banner (endpoint admin)
     * @param bannerId
     * @returns void
     * @throws ApiError
     */
    public deleteBannerApiDeliveryParceirosAdminBannersBannerIdDelete(
        bannerId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/parceiros/admin/banners/{banner_id}',
            path: {
                'banner_id': bannerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
