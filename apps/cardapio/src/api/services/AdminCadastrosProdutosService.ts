/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_atualizar_produto_api_cadastros_admin_produtos__cod_barras__put } from '../models/Body_atualizar_produto_api_cadastros_admin_produtos__cod_barras__put';
import type { Body_criar_produto_api_cadastros_admin_produtos__post } from '../models/Body_criar_produto_api_cadastros_admin_produtos__post';
import type { CriarNovoProdutoResponse } from '../models/CriarNovoProdutoResponse';
import type { ProdutosPaginadosResponse } from '../models/ProdutosPaginadosResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminCadastrosProdutosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Search Produtos
     * @param codEmpresa Empresa dona dos vínculos
     * @param q Termo de busca (descrição ou código de barras)
     * @param page
     * @param limit
     * @param apenasDisponiveis Somente ativos+disponíveis
     * @returns any Successful Response
     * @throws ApiError
     */
    public searchProdutosApiCadastrosAdminProdutosSearchGet(
        codEmpresa: number,
        q?: (string | null),
        page: number = 1,
        limit: number = 30,
        apenasDisponiveis: boolean = false,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/produtos/search',
            query: {
                'cod_empresa': codEmpresa,
                'q': q,
                'page': page,
                'limit': limit,
                'apenas_disponiveis': apenasDisponiveis,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Lista produtos ERP
     * Retorna produtos com todas as colunas inclusas para exibição
     * @param codEmpresa
     * @param page
     * @param limit
     * @param apenasDisponiveis
     * @param search Termo de busca (código de barras, descrição ou SKU)
     * @returns ProdutosPaginadosResponse Successful Response
     * @throws ApiError
     */
    public listarDeliveryApiCadastrosAdminProdutosGet(
        codEmpresa: number,
        page: number = 1,
        limit: number = 30,
        apenasDisponiveis: boolean = false,
        search?: (string | null),
    ): CancelablePromise<ProdutosPaginadosResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/produtos/',
            query: {
                'cod_empresa': codEmpresa,
                'page': page,
                'limit': limit,
                'apenas_disponiveis': apenasDisponiveis,
                'search': search,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Produto
     * @param formData
     * @returns CriarNovoProdutoResponse Successful Response
     * @throws ApiError
     */
    public criarProdutoApiCadastrosAdminProdutosPost(
        formData: Body_criar_produto_api_cadastros_admin_produtos__post,
    ): CancelablePromise<CriarNovoProdutoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/produtos/',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Produto
     * @param codBarras
     * @param formData
     * @returns CriarNovoProdutoResponse Successful Response
     * @throws ApiError
     */
    public atualizarProdutoApiCadastrosAdminProdutosCodBarrasPut(
        codBarras: string,
        formData: Body_atualizar_produto_api_cadastros_admin_produtos__cod_barras__put,
    ): CancelablePromise<CriarNovoProdutoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/produtos/{cod_barras}',
            path: {
                'cod_barras': codBarras,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Produto
     * @param codBarras
     * @param empresaId Empresa dona do vínculo a ser removido
     * @returns void
     * @throws ApiError
     */
    public deletarProdutoApiCadastrosAdminProdutosCodBarrasDelete(
        codBarras: string,
        empresaId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/produtos/{cod_barras}',
            path: {
                'cod_barras': codBarras,
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
