/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdicionalResponse } from '../models/AdicionalResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClientCadastrosAdicionaisService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Adicionais Produto
     * Lista todos os adicionais disponíveis de um produto específico.
     *
     * Requer autenticação via header `X-Super-Token` do cliente.
     * Retorna apenas adicionais ativos (a menos que apenas_ativos=false).
     * @param codBarras
     * @param xSuperToken
     * @param apenasAtivos
     * @returns AdicionalResponse Successful Response
     * @throws ApiError
     */
    public listarAdicionaisProdutoApiCadastrosClientAdicionaisProdutoCodBarrasGet(
        codBarras: string,
        xSuperToken: string,
        apenasAtivos: boolean = true,
    ): CancelablePromise<Array<AdicionalResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/client/adicionais/produto/{cod_barras}',
            path: {
                'cod_barras': codBarras,
            },
            headers: {
                'x-super-token': xSuperToken,
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
