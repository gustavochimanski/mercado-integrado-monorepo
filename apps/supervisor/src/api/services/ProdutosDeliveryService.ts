/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_atualizar_produto_api_delivery_produtos_delivery__cod_barras__put } from '../models/Body_atualizar_produto_api_delivery_produtos_delivery__cod_barras__put';
import type { Body_criar_produto_api_delivery_produtos_delivery_post } from '../models/Body_criar_produto_api_delivery_produtos_delivery_post';
import type { CriarNovoProdutoResponse } from '../models/CriarNovoProdutoResponse';
import type { ProdutosPaginadosResponse } from '../models/ProdutosPaginadosResponse';
import type { SetDisponibilidadeRequest } from '../models/SetDisponibilidadeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProdutosDeliveryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Delivery
     * @param codEmpresa
     * @param page
     * @param limit
     * @param apenasDisponiveis
     * @returns ProdutosPaginadosResponse Successful Response
     * @throws ApiError
     */
    public listarDeliveryApiDeliveryProdutosDeliveryGet(
        codEmpresa: number,
        page: number = 1,
        limit: number = 30,
        apenasDisponiveis: boolean = false,
    ): CancelablePromise<ProdutosPaginadosResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/produtos/delivery',
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
    public criarProdutoApiDeliveryProdutosDeliveryPost(
        formData: Body_criar_produto_api_delivery_produtos_delivery_post,
    ): CancelablePromise<CriarNovoProdutoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/produtos/delivery',
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
    public atualizarProdutoApiDeliveryProdutosDeliveryCodBarrasPut(
        codBarras: string,
        formData: Body_atualizar_produto_api_delivery_produtos_delivery__cod_barras__put,
    ): CancelablePromise<CriarNovoProdutoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/produtos/delivery/{cod_barras}',
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
     * @returns void
     * @throws ApiError
     */
    public deletarProdutoApiDeliveryProdutosDeliveryCodBarrasDelete(
        codBarras: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/produtos/delivery/{cod_barras}',
            path: {
                'cod_barras': codBarras,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Disponibilidade
     * Liga/desliga disponibilidade do produto (empresa x produto).
     * @param codBarras
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public setDisponibilidadeApiDeliveryProdutosDeliveryCodBarrasDisponibilidadePatch(
        codBarras: string,
        requestBody: SetDisponibilidadeRequest,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/delivery/produtos/delivery/{cod_barras}/disponibilidade',
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
}
