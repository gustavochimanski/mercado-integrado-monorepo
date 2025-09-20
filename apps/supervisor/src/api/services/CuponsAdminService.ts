/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CupomCreate } from '../models/CupomCreate';
import type { CupomLinkCreate } from '../models/CupomLinkCreate';
import type { CupomLinkOut } from '../models/CupomLinkOut';
import type { CupomOut } from '../models/CupomOut';
import type { CupomUpdate } from '../models/CupomUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CuponsAdminService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Cupons
     * @returns CupomOut Successful Response
     * @throws ApiError
     */
    public listarCuponsApiDeliveryCuponsGet(): CancelablePromise<Array<CupomOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/cupons',
        });
    }
    /**
     * Criar Cupom
     * @param requestBody
     * @returns CupomOut Successful Response
     * @throws ApiError
     */
    public criarCupomApiDeliveryCuponsPost(
        requestBody: CupomCreate,
    ): CancelablePromise<CupomOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/cupons',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter Cupom
     * @param cupomId
     * @returns CupomOut Successful Response
     * @throws ApiError
     */
    public obterCupomApiDeliveryCuponsCupomIdGet(
        cupomId: number,
    ): CancelablePromise<CupomOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/cupons/{cupom_id}',
            path: {
                'cupom_id': cupomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Cupom
     * @param cupomId
     * @param requestBody
     * @returns CupomOut Successful Response
     * @throws ApiError
     */
    public atualizarCupomApiDeliveryCuponsCupomIdPut(
        cupomId: number,
        requestBody: CupomUpdate,
    ): CancelablePromise<CupomOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/cupons/{cupom_id}',
            path: {
                'cupom_id': cupomId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Cupom
     * @param cupomId
     * @returns void
     * @throws ApiError
     */
    public deletarCupomApiDeliveryCuponsCupomIdDelete(
        cupomId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/cupons/{cupom_id}',
            path: {
                'cupom_id': cupomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter Por Codigo
     * @param codigo
     * @returns CupomOut Successful Response
     * @throws ApiError
     */
    public obterPorCodigoApiDeliveryCuponsByCodeCodigoGet(
        codigo: string,
    ): CancelablePromise<CupomOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/cupons/by-code/{codigo}',
            path: {
                'codigo': codigo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Links
     * @param cupomId
     * @returns CupomLinkOut Successful Response
     * @throws ApiError
     */
    public listarLinksApiDeliveryCuponsLinksCupomIdGet(
        cupomId: number,
    ): CancelablePromise<Array<CupomLinkOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/cupons/links/{cupom_id}',
            path: {
                'cupom_id': cupomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Link
     * @param cupomId
     * @param requestBody
     * @returns CupomLinkOut Successful Response
     * @throws ApiError
     */
    public criarLinkApiDeliveryCuponsLinksCupomIdPost(
        cupomId: number,
        requestBody: CupomLinkCreate,
    ): CancelablePromise<CupomLinkOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/cupons/links/{cupom_id}',
            path: {
                'cupom_id': cupomId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Link
     * @param linkId
     * @param requestBody
     * @returns CupomLinkOut Successful Response
     * @throws ApiError
     */
    public atualizarLinkApiDeliveryCuponsLinksLinkIdPut(
        linkId: number,
        requestBody: CupomLinkCreate,
    ): CancelablePromise<CupomLinkOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/cupons/links/{link_id}',
            path: {
                'link_id': linkId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Link
     * @param linkId
     * @returns void
     * @throws ApiError
     */
    public deletarLinkApiDeliveryCuponsLinksLinkIdDelete(
        linkId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/cupons/links/{link_id}',
            path: {
                'link_id': linkId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
