/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__api__cardapio__schemas__schema_endereco__EnderecoCreate } from '../models/app__api__cardapio__schemas__schema_endereco__EnderecoCreate';
import type { app__api__cardapio__schemas__schema_endereco__EnderecoOut } from '../models/app__api__cardapio__schemas__schema_endereco__EnderecoOut';
import type { EnderecoUpdate } from '../models/EnderecoUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClientCadastrosEndereOsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Enderecos
     * @param xSuperToken
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public listarEnderecosApiCadastrosClientEnderecosGet(
        xSuperToken: string,
    ): CancelablePromise<Array<app__api__cardapio__schemas__schema_endereco__EnderecoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/client/enderecos',
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
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public criarEnderecoApiCadastrosClientEnderecosPost(
        xSuperToken: string,
        requestBody: app__api__cardapio__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/client/enderecos',
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
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public getEnderecoApiCadastrosClientEnderecosEnderecoIdGet(
        enderecoId: number,
        xSuperToken: string,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/client/enderecos/{endereco_id}',
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
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public atualizarEnderecoApiCadastrosClientEnderecosEnderecoIdPut(
        enderecoId: number,
        xSuperToken: string,
        requestBody: EnderecoUpdate,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/client/enderecos/{endereco_id}',
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
    public deletarEnderecoApiCadastrosClientEnderecosEnderecoIdDelete(
        enderecoId: number,
        xSuperToken: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/client/enderecos/{endereco_id}',
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
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public setEnderecoPadraoApiCadastrosClientEnderecosEnderecoIdSetPadraoPost(
        enderecoId: number,
        xSuperToken: string,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/client/enderecos/{endereco_id}/set-padrao',
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
