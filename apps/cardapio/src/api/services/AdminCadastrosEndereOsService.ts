/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__api__cardapio__schemas__schema_endereco__EnderecoCreate } from '../models/app__api__cardapio__schemas__schema_endereco__EnderecoCreate';
import type { app__api__cardapio__schemas__schema_endereco__EnderecoOut } from '../models/app__api__cardapio__schemas__schema_endereco__EnderecoOut';
import type { EnderecoUpdate } from '../models/EnderecoUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminCadastrosEndereOsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Enderecos Admin
     * Endpoint para admin listar endereços de um cliente específico.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente para listar endereços
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public listarEnderecosAdminApiCadastrosAdminEnderecosClienteClienteIdGet(
        clienteId: number,
    ): CancelablePromise<Array<app__api__cardapio__schemas__schema_endereco__EnderecoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/enderecos/cliente/{cliente_id}',
            path: {
                'cliente_id': clienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Endereco Admin
     * Endpoint para admin criar endereço para um cliente específico.
     * Verifica se o endereço já existe antes de criar.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente para criar endereço
     * @param requestBody
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public criarEnderecoAdminApiCadastrosAdminEnderecosClienteClienteIdPost(
        clienteId: number,
        requestBody: app__api__cardapio__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/enderecos/cliente/{cliente_id}',
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
     * Atualizar Endereco Admin
     * Endpoint para admin atualizar endereço de um cliente específico.
     * Verifica se o endereço já existe antes de atualizar.
     * Verifica se o endereço está sendo usado em pedidos ativos.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente
     * @param enderecoId ID do endereço para atualizar
     * @param requestBody
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public atualizarEnderecoAdminApiCadastrosAdminEnderecosClienteClienteIdEnderecoEnderecoIdPut(
        clienteId: number,
        enderecoId: number,
        requestBody: EnderecoUpdate,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/enderecos/cliente/{cliente_id}/endereco/{endereco_id}',
            path: {
                'cliente_id': clienteId,
                'endereco_id': enderecoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
