/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConsultaMovimentoCompraRequest } from '../models/ConsultaMovimentoCompraRequest';
import type { ConsultaMovimentoCompraResponse } from '../models/ConsultaMovimentoCompraResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ComprasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Resumo Compras Empresa
     * Endpoint para consultar movimentos de compra:
     * - Recebe datas e lista de empresas.
     * - Injetamos a sessão do DB via Depends(get_db).
     * - Encaminha para o service e trata exceções.
     * @param requestBody
     * @returns ConsultaMovimentoCompraResponse Successful Response
     * @throws ApiError
     */
    public handleConsultaMovimentoCompraBiComprasConsultaMovimentoPost(
        requestBody: ConsultaMovimentoCompraRequest,
    ): CancelablePromise<ConsultaMovimentoCompraResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/bi/compras/consulta_movimento',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
