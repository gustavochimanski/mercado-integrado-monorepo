/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntregadorCreate } from '../models/EntregadorCreate';
import type { EntregadorOut } from '../models/EntregadorOut';
import type { EntregadorUpdate } from '../models/EntregadorUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminCadastrosEntregadoresService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Entregadores
     * @returns EntregadorOut Successful Response
     * @throws ApiError
     */
    public listarEntregadoresApiCadastrosAdminEntregadoresGet(): CancelablePromise<Array<EntregadorOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/entregadores',
        });
    }
    /**
     * Criar Entregador
     * @param requestBody
     * @returns EntregadorOut Successful Response
     * @throws ApiError
     */
    public criarEntregadorApiCadastrosAdminEntregadoresPost(
        requestBody: EntregadorCreate,
    ): CancelablePromise<EntregadorOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/entregadores',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Entregador
     * @param entregadorId
     * @returns EntregadorOut Successful Response
     * @throws ApiError
     */
    public getEntregadorApiCadastrosAdminEntregadoresEntregadorIdGet(
        entregadorId: number,
    ): CancelablePromise<EntregadorOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/entregadores/{entregador_id}',
            path: {
                'entregador_id': entregadorId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Entregador
     * @param entregadorId
     * @param requestBody
     * @returns EntregadorOut Successful Response
     * @throws ApiError
     */
    public atualizarEntregadorApiCadastrosAdminEntregadoresEntregadorIdPut(
        entregadorId: number,
        requestBody: EntregadorUpdate,
    ): CancelablePromise<EntregadorOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/entregadores/{entregador_id}',
            path: {
                'entregador_id': entregadorId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Entregador
     * @param entregadorId
     * @returns void
     * @throws ApiError
     */
    public deletarEntregadorApiCadastrosAdminEntregadoresEntregadorIdDelete(
        entregadorId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/entregadores/{entregador_id}',
            path: {
                'entregador_id': entregadorId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Vincular Entregador Empresa
     * @param entregadorId
     * @param empresaId ID da empresa a ser vinculada
     * @returns EntregadorOut Successful Response
     * @throws ApiError
     */
    public vincularEntregadorEmpresaApiCadastrosAdminEntregadoresEntregadorIdVincularEmpresaPost(
        entregadorId: number,
        empresaId: number,
    ): CancelablePromise<EntregadorOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/entregadores/{entregador_id}/vincular_empresa',
            path: {
                'entregador_id': entregadorId,
            },
            query: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Desvincular Entregador Empresa
     * @param entregadorId
     * @param empresaId ID da empresa a ser desvinculada
     * @returns EntregadorOut Successful Response
     * @throws ApiError
     */
    public desvincularEntregadorEmpresaApiCadastrosAdminEntregadoresEntregadorIdVincularEmpresaDelete(
        entregadorId: number,
        empresaId: number,
    ): CancelablePromise<EntregadorOut> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/entregadores/{entregador_id}/vincular_empresa',
            path: {
                'entregador_id': entregadorId,
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
