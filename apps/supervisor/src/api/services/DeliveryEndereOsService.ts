/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__api__delivery__schemas__endereco_dv_schema__EnderecoCreate } from '../models/app__api__delivery__schemas__endereco_dv_schema__EnderecoCreate';
import type { app__api__delivery__schemas__endereco_dv_schema__EnderecoUpdate } from '../models/app__api__delivery__schemas__endereco_dv_schema__EnderecoUpdate';
import type { EnderecoOut } from '../models/EnderecoOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DeliveryEndereOsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Enderecos
     * @param clienteId
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public listarEnderecosApiDeliveryEnderecosGet(
        clienteId: number,
    ): CancelablePromise<Array<EnderecoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/enderecos',
            query: {
                'cliente_id': clienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Endereco
     * @param requestBody
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public criarEnderecoApiDeliveryEnderecosPost(
        requestBody: app__api__delivery__schemas__endereco_dv_schema__EnderecoCreate,
    ): CancelablePromise<EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/enderecos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Endereco
     * @param enderecoId
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public getEnderecoApiDeliveryEnderecosEnderecoIdGet(
        enderecoId: number,
    ): CancelablePromise<EnderecoOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/enderecos/{endereco_id}',
            path: {
                'endereco_id': enderecoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Endereco
     * @param enderecoId
     * @param requestBody
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public atualizarEnderecoApiDeliveryEnderecosEnderecoIdPut(
        enderecoId: number,
        requestBody: app__api__delivery__schemas__endereco_dv_schema__EnderecoUpdate,
    ): CancelablePromise<EnderecoOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/enderecos/{endereco_id}',
            path: {
                'endereco_id': enderecoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Endereco
     * @param enderecoId
     * @returns void
     * @throws ApiError
     */
    public deletarEnderecoApiDeliveryEnderecosEnderecoIdDelete(
        enderecoId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/enderecos/{endereco_id}',
            path: {
                'endereco_id': enderecoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Endereco Padrao
     * @param enderecoId
     * @param clienteId
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public setEnderecoPadraoApiDeliveryEnderecosEnderecoIdSetPadraoPost(
        enderecoId: number,
        clienteId: number,
    ): CancelablePromise<EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/enderecos/{endereco_id}/set-padrao',
            path: {
                'endereco_id': enderecoId,
            },
            query: {
                'cliente_id': clienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
