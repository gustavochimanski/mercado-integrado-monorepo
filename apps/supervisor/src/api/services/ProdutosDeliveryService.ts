/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_criar_produto_api_mensura_produtos_post } from '../models/Body_criar_produto_api_mensura_produtos_post';
import type { CriarNovoProdutoResponse } from '../models/CriarNovoProdutoResponse';
import type { ProdutosPaginadosResponse } from '../models/ProdutosPaginadosResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProdutosDeliveryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Lista produtos ERP
     * Retorna produtos com todas as colunas inclusas para exibição
     * @param codEmpresa
     * @param page
     * @param limit
     * @param apenasDisponiveis
     * @returns ProdutosPaginadosResponse Successful Response
     * @throws ApiError
     */
    public listarDeliveryApiMensuraProdutosGet(
        codEmpresa: number,
        page: number = 1,
        limit: number = 30,
        apenasDisponiveis: boolean = false,
    ): CancelablePromise<ProdutosPaginadosResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/produtos',
            query: {
                'cod_empresa': codEmpresa,
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
     * Criar Produto
     * @param formData
     * @returns CriarNovoProdutoResponse Successful Response
     * @throws ApiError
     */
    public criarProdutoApiMensuraProdutosPost(
        formData: Body_criar_produto_api_mensura_produtos_post,
    ): CancelablePromise<CriarNovoProdutoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mensura/produtos',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
