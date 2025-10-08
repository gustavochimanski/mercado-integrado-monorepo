/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CupomCreate } from '../models/CupomCreate';
import type { CupomOut } from '../models/CupomOut';
import type { CupomUpdate } from '../models/CupomUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class CuponsAdminDeliveryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Cupons
     * @param parceiroId
     * @returns CupomOut Successful Response
     * @throws ApiError
     */
    public listarCuponsApiDeliveryCuponsGet(
        parceiroId?: (number | null),
    ): CancelablePromise<Array<CupomOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/cupons',
            query: {
                'parceiro_id': parceiroId,
            },
            errors: {
                422: `Validation Error`,
            },
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
     * @param empresaId
     * @returns CupomOut Successful Response
     * @throws ApiError
     */
    public obterPorCodigoApiDeliveryCuponsByCodeCodigoGet(
        codigo: string,
        empresaId?: (number | null),
    ): CancelablePromise<CupomOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/cupons/by-code/{codigo}',
            path: {
                'codigo': codigo,
            },
            query: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
