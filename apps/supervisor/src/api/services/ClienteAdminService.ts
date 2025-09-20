/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClienteAdminUpdate } from '../models/ClienteAdminUpdate';
import type { ClienteOut } from '../models/ClienteOut';
import type { EnderecoOut } from '../models/EnderecoOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClienteAdminService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Update Cliente Admin
     * @param clienteId
     * @param requestBody
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public updateClienteAdminApiDeliveryClienteAdminUpdateClienteIdPut(
        clienteId: number,
        requestBody: ClienteAdminUpdate,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/cliente/admin/update/{cliente_id}',
            path: {
                'cliente_id': clienteId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Enderecos Cliente
     * Endpoint para consultar endereços de um cliente específico.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente para consultar endereços
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public getEnderecosClienteApiDeliveryClienteAdminClienteIdEnderecosGet(
        clienteId: number,
    ): CancelablePromise<Array<EnderecoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/cliente/admin/{cliente_id}/enderecos',
            path: {
                'cliente_id': clienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
