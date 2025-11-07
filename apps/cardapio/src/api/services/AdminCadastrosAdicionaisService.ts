/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdicionalResponse } from '../models/AdicionalResponse';
import type { AtualizarAdicionalRequest } from '../models/AtualizarAdicionalRequest';
import type { CriarAdicionalRequest } from '../models/CriarAdicionalRequest';
import type { VincularAdicionaisProdutoRequest } from '../models/VincularAdicionaisProdutoRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminCadastrosAdicionaisService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Adicionais
     * Lista todos os adicionais de uma empresa.
     * @param empresaId
     * @param apenasAtivos
     * @returns AdicionalResponse Successful Response
     * @throws ApiError
     */
    public listarAdicionaisApiCadastrosAdminAdicionaisGet(
        empresaId: number,
        apenasAtivos: boolean = true,
    ): CancelablePromise<Array<AdicionalResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/adicionais/',
            query: {
                'empresa_id': empresaId,
                'apenas_ativos': apenasAtivos,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Adicional
     * Cria um novo adicional.
     * @param requestBody
     * @returns AdicionalResponse Successful Response
     * @throws ApiError
     */
    public criarAdicionalApiCadastrosAdminAdicionaisPost(
        requestBody: CriarAdicionalRequest,
    ): CancelablePromise<AdicionalResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/adicionais/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Buscar Adicional
     * Busca um adicional por ID.
     * @param adicionalId
     * @returns AdicionalResponse Successful Response
     * @throws ApiError
     */
    public buscarAdicionalApiCadastrosAdminAdicionaisAdicionalIdGet(
        adicionalId: number,
    ): CancelablePromise<AdicionalResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/adicionais/{adicional_id}',
            path: {
                'adicional_id': adicionalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Adicional
     * Atualiza um adicional existente.
     * @param adicionalId
     * @param requestBody
     * @returns AdicionalResponse Successful Response
     * @throws ApiError
     */
    public atualizarAdicionalApiCadastrosAdminAdicionaisAdicionalIdPut(
        adicionalId: number,
        requestBody: AtualizarAdicionalRequest,
    ): CancelablePromise<AdicionalResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/adicionais/{adicional_id}',
            path: {
                'adicional_id': adicionalId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Adicional
     * Deleta um adicional.
     * @param adicionalId
     * @returns any Successful Response
     * @throws ApiError
     */
    public deletarAdicionalApiCadastrosAdminAdicionaisAdicionalIdDelete(
        adicionalId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/adicionais/{adicional_id}',
            path: {
                'adicional_id': adicionalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Vincular Adicionais Produto
     * Vincula múltiplos adicionais a um produto.
     * @param codBarras
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public vincularAdicionaisProdutoApiCadastrosAdminAdicionaisProdutoCodBarrasVincularPost(
        codBarras: string,
        requestBody: VincularAdicionaisProdutoRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/adicionais/produto/{cod_barras}/vincular',
            path: {
                'cod_barras': codBarras,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Adicionais Produto
     * Lista todos os adicionais de um produto específico.
     * @param codBarras
     * @param apenasAtivos
     * @returns AdicionalResponse Successful Response
     * @throws ApiError
     */
    public listarAdicionaisProdutoApiCadastrosAdminAdicionaisProdutoCodBarrasGet(
        codBarras: string,
        apenasAtivos: boolean = true,
    ): CancelablePromise<Array<AdicionalResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/adicionais/produto/{cod_barras}',
            path: {
                'cod_barras': codBarras,
            },
            query: {
                'apenas_ativos': apenasAtivos,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
