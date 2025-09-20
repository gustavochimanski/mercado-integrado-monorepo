/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClienteCreate } from '../models/ClienteCreate';
import type { ClienteOut } from '../models/ClienteOut';
import type { ClienteUpdate } from '../models/ClienteUpdate';
import type { ConfirmacaoCodigoRequest } from '../models/ConfirmacaoCodigoRequest';
import type { NovoDispositivoRequest } from '../models/NovoDispositivoRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClienteClienteService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Novo Dispositivo
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public novoDispositivoApiDeliveryClienteNovoDispositivoPost(
        requestBody: NovoDispositivoRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/cliente/novo-dispositivo',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirmar Codigo
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public confirmarCodigoApiDeliveryClienteConfirmarCodigoPost(
        requestBody: ConfirmacaoCodigoRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/cliente/confirmar-codigo',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create New Cliente
     * @param requestBody
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public createNewClienteApiDeliveryClientePost(
        requestBody: ClienteCreate,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/cliente/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Current Cliente
     * @param xSuperToken
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public readCurrentClienteApiDeliveryClienteMeGet(
        xSuperToken: string,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/cliente/me',
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Current Cliente
     * @param xSuperToken
     * @param requestBody
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public updateCurrentClienteApiDeliveryClienteMePut(
        xSuperToken: string,
        requestBody: ClienteUpdate,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/cliente/me',
            headers: {
                'x-super-token': xSuperToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
