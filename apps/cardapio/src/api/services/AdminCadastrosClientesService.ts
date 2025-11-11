/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__api__cardapio__schemas__schema_endereco__EnderecoCreate } from '../models/app__api__cardapio__schemas__schema_endereco__EnderecoCreate';
import type { app__api__cardapio__schemas__schema_endereco__EnderecoOut } from '../models/app__api__cardapio__schemas__schema_endereco__EnderecoOut';
import type { ClienteAdminUpdate } from '../models/ClienteAdminUpdate';
import type { ClienteCreate } from '../models/ClienteCreate';
import type { ClienteOut } from '../models/ClienteOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminCadastrosClientesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Clientes
     * Endpoint para listar todos os clientes.
     * Requer autenticação de admin.
     * @param ativo Filtrar por status ativo/inativo
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public listarClientesApiCadastrosAdminClientesGet(
        ativo?: (boolean | null),
    ): CancelablePromise<Array<ClienteOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/clientes/',
            query: {
                'ativo': ativo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Cliente
     * Endpoint para criar um novo cliente.
     * Requer autenticação de admin.
     * @param requestBody
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public criarClienteApiCadastrosAdminClientesPost(
        requestBody: ClienteCreate,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/clientes/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Cliente
     * Endpoint para obter um cliente específico por ID.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public getClienteApiCadastrosAdminClientesClienteIdGet(
        clienteId: number,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/clientes/{cliente_id}',
            path: {
                'cliente_id': clienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Cliente
     * Endpoint para deletar um cliente.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente
     * @returns void
     * @throws ApiError
     */
    public deletarClienteApiCadastrosAdminClientesClienteIdDelete(
        clienteId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/clientes/{cliente_id}',
            path: {
                'cliente_id': clienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Cliente Admin
     * @param clienteId
     * @param requestBody
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public updateClienteAdminApiCadastrosAdminClientesUpdateClienteIdPut(
        clienteId: number,
        requestBody: ClienteAdminUpdate,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/clientes/update/{cliente_id}',
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
     * Criar Endereco Cliente
     * Endpoint para criar um novo endereço para um cliente específico.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente para adicionar endereço
     * @param requestBody
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public criarEnderecoClienteApiCadastrosAdminClientesClienteIdCriarEnderecoPost(
        clienteId: number,
        requestBody: app__api__cardapio__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/clientes/{cliente_id}/criar-endereco',
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
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public getEnderecosClienteApiCadastrosAdminClientesClienteIdUpdateEnderecoGet(
        clienteId: number,
    ): CancelablePromise<Array<app__api__cardapio__schemas__schema_endereco__EnderecoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/clientes/{cliente_id}/update-endereco',
            path: {
                'cliente_id': clienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
