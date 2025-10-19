/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__api__delivery__schemas__schema_endereco__EnderecoCreate } from '../models/app__api__delivery__schemas__schema_endereco__EnderecoCreate';
import type { app__api__delivery__schemas__schema_endereco__EnderecoUpdate } from '../models/app__api__delivery__schemas__schema_endereco__EnderecoUpdate';
import type { EnderecoOut } from '../models/EnderecoOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClientEnderecosDeliveryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Enderecos
     * @param xSuperToken
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public listarEnderecosApiDeliveryClientEnderecosGet(
        xSuperToken: string,
    ): CancelablePromise<Array<EnderecoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/client/enderecos',
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Endereco
     * @param xSuperToken
     * @param requestBody
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public criarEnderecoApiDeliveryClientEnderecosPost(
        xSuperToken: string,
        requestBody: app__api__delivery__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/client/enderecos',
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
    /**
     * Get Endereco
     * @param enderecoId
     * @param xSuperToken
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public getEnderecoApiDeliveryClientEnderecosEnderecoIdGet(
        enderecoId: number,
        xSuperToken: string,
    ): CancelablePromise<EnderecoOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/client/enderecos/{endereco_id}',
            path: {
                'endereco_id': enderecoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Endereco
     * @param enderecoId
     * @param xSuperToken
     * @param requestBody
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public atualizarEnderecoApiDeliveryClientEnderecosEnderecoIdPut(
        enderecoId: number,
        xSuperToken: string,
        requestBody: app__api__delivery__schemas__schema_endereco__EnderecoUpdate,
    ): CancelablePromise<EnderecoOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/client/enderecos/{endereco_id}',
            path: {
                'endereco_id': enderecoId,
            },
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
    /**
     * Deletar Endereco
     * @param enderecoId
     * @param xSuperToken
     * @returns void
     * @throws ApiError
     */
    public deletarEnderecoApiDeliveryClientEnderecosEnderecoIdDelete(
        enderecoId: number,
        xSuperToken: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/client/enderecos/{endereco_id}',
            path: {
                'endereco_id': enderecoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Endereco Padrao
     * @param enderecoId
     * @param xSuperToken
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public setEnderecoPadraoApiDeliveryClientEnderecosEnderecoIdSetPadraoPost(
        enderecoId: number,
        xSuperToken: string,
    ): CancelablePromise<EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/client/enderecos/{endereco_id}/set-padrao',
            path: {
                'endereco_id': enderecoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
