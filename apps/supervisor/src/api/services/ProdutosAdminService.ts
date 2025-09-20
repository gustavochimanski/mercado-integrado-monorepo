/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_atualizar_produto_api_delivery_produtos__cod_barras__put } from '../models/Body_atualizar_produto_api_delivery_produtos__cod_barras__put';
import type { CriarNovoProdutoResponse } from '../models/CriarNovoProdutoResponse';
import type { SetDisponibilidadeRequest } from '../models/SetDisponibilidadeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProdutosAdminService {
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
    public searchProdutosApiDeliveryProdutosSearchGet(
        codEmpresa: number,
        q?: (string | null),
        page: number = 1,
        limit: number = 30,
        apenasDisponiveis: boolean = false,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/produtos/search',
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
     * Atualizar Produto
     * @param codBarras
     * @param formData
     * @returns CriarNovoProdutoResponse Successful Response
     * @throws ApiError
     */
    public atualizarProdutoApiDeliveryProdutosCodBarrasPut(
        codBarras: string,
        formData: Body_atualizar_produto_api_delivery_produtos__cod_barras__put,
    ): CancelablePromise<CriarNovoProdutoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/produtos/{cod_barras}',
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
    public deletarProdutoApiDeliveryProdutosCodBarrasDelete(
        codBarras: string,
        empresaId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/produtos/{cod_barras}',
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
    /**
     * Set Disponibilidade
     * @param codBarras
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public setDisponibilidadeApiDeliveryProdutosCodBarrasDisponibilidadePatch(
        codBarras: string,
        requestBody: SetDisponibilidadeRequest,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/delivery/produtos/{cod_barras}/disponibilidade',
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
