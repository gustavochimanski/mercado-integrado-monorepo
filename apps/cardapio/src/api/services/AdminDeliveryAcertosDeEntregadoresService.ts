/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcertosPassadosResponse } from '../models/AcertosPassadosResponse';
import type { FecharPedidosDiretoRequest } from '../models/FecharPedidosDiretoRequest';
import type { FecharPedidosDiretoResponse } from '../models/FecharPedidosDiretoResponse';
import type { PedidoPendenteAcertoOut } from '../models/PedidoPendenteAcertoOut';
import type { PreviewAcertoResponse } from '../models/PreviewAcertoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminDeliveryAcertosDeEntregadoresService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Fechar Pedidos
     * Fecha pedidos por período (empresa obrigatória; entregador opcional).
     * @param requestBody
     * @returns FecharPedidosDiretoResponse Successful Response
     * @throws ApiError
     */
    public fecharPedidosApiDeliveryAdminAcertosEntregadoresFecharPost(
        requestBody: FecharPedidosDiretoRequest,
    ): CancelablePromise<FecharPedidosDiretoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/admin/acertos-entregadores/fechar',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Pendentes
     * Lista pedidos entregues ainda não acertados no período, opcionalmente filtrando por entregador.
     * @param empresaId
     * @param inicio Início do período (YYYY-MM-DD ou ISO datetime)
     * @param fim Fim do período (YYYY-MM-DD ou ISO datetime)
     * @param entregadorId
     * @returns PedidoPendenteAcertoOut Successful Response
     * @throws ApiError
     */
    public listarPendentesApiDeliveryAdminAcertosEntregadoresPendentesGet(
        empresaId: number,
        inicio: string,
        fim: string,
        entregadorId?: (number | null),
    ): CancelablePromise<Array<PedidoPendenteAcertoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/admin/acertos-entregadores/pendentes',
            query: {
                'empresa_id': empresaId,
                'inicio': inicio,
                'fim': fim,
                'entregador_id': entregadorId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Preview Acerto
     * @param empresaId
     * @param inicio
     * @param fim
     * @param entregadorId
     * @returns PreviewAcertoResponse Successful Response
     * @throws ApiError
     */
    public previewAcertoApiDeliveryAdminAcertosEntregadoresPreviewGet(
        empresaId: number,
        inicio: string,
        fim: string,
        entregadorId?: (number | null),
    ): CancelablePromise<PreviewAcertoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/admin/acertos-entregadores/preview',
            query: {
                'empresa_id': empresaId,
                'inicio': inicio,
                'fim': fim,
                'entregador_id': entregadorId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Acertos Passados
     * @param empresaId
     * @param inicio
     * @param fim
     * @param entregadorId
     * @returns AcertosPassadosResponse Successful Response
     * @throws ApiError
     */
    public acertosPassadosApiDeliveryAdminAcertosEntregadoresPassadosGet(
        empresaId: number,
        inicio: string,
        fim: string,
        entregadorId?: (number | null),
    ): CancelablePromise<AcertosPassadosResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/admin/acertos-entregadores/passados',
            query: {
                'empresa_id': empresaId,
                'inicio': inicio,
                'fim': fim,
                'entregador_id': entregadorId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
