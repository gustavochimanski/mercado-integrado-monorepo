/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryPageResponse } from '../models/CategoryPageResponse';
import type { EmpresaClientOut } from '../models/EmpresaClientOut';
import type { HomeResponse } from '../models/HomeResponse';
import type { MercadoPagoWebhookPayload } from '../models/MercadoPagoWebhookPayload';
import type { PedidoPendenteImpressaoResponse } from '../models/PedidoPendenteImpressaoResponse';
import type { RespostaImpressaoPrinter } from '../models/RespostaImpressaoPrinter';
import type { VitrineComProdutosResponse } from '../models/VitrineComProdutosResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PublicRotasPBlicasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Listar Pedidos Pendentes Impressao
     * Lista todos os pedidos pendentes de impressão de uma empresa.
     * @param empresaId ID da empresa
     * @param limite Número máximo de pedidos para listar
     * @returns PedidoPendenteImpressaoResponse Successful Response
     * @throws ApiError
     */
    public listarPedidosPendentesImpressaoApiDeliveryPrinterPedidosPendentesGet(
        empresaId: number,
        limite: number = 50,
    ): CancelablePromise<Array<PedidoPendenteImpressaoResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/printer/pedidos-pendentes',
            query: {
                'empresa_id': empresaId,
                'limite': limite,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Marcar Pedido Impresso Manual
     * Marca um pedido como impresso manualmente (sem usar Printer API).
     * Útil quando a impressão é feita externamente.
     * @param pedidoId ID do pedido
     * @returns RespostaImpressaoPrinter Successful Response
     * @throws ApiError
     */
    public marcarPedidoImpressoManualApiDeliveryPrinterMarcarImpressoPedidoIdPut(
        pedidoId: number,
    ): CancelablePromise<RespostaImpressaoPrinter> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/printer/marcar-impresso/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Estatisticas Impressao
     * Retorna estatísticas de impressão para uma empresa.
     * @param empresaId ID da empresa
     * @returns any Successful Response
     * @throws ApiError
     */
    public getEstatisticasImpressaoApiDeliveryPrinterEstatisticasGet(
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/printer/estatisticas',
            query: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Home
     * @param empresaId ID da empresa
     * @param isHome Filtra home: categorias raiz e/ou vitrines da home
     * @returns HomeResponse Successful Response
     * @throws ApiError
     */
    public listarHomeApiDeliveryPublicHomeHomeGet(
        empresaId: number,
        isHome: boolean,
    ): CancelablePromise<HomeResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/public/home/home',
            query: {
                'empresa_id': empresaId,
                'is_home': isHome,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Vitrines E Produtos Por Categoria
     * @param empresaId
     * @param codCategoria
     * @param slug
     * @returns VitrineComProdutosResponse Successful Response
     * @throws ApiError
     */
    public listarVitrinesEProdutosPorCategoriaApiDeliveryPublicHomeHomeVitrinePorCategoriaGet(
        empresaId: number,
        codCategoria?: (number | null),
        slug?: (string | null),
    ): CancelablePromise<Array<VitrineComProdutosResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/public/home/home/vitrine-por-categoria',
            query: {
                'empresa_id': empresaId,
                'cod_categoria': codCategoria,
                'slug': slug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Categoria Page
     * @param empresaId
     * @param slug Slug da categoria atual
     * @returns CategoryPageResponse Successful Response
     * @throws ApiError
     */
    public getCategoriaPageApiDeliveryPublicHomeHomeCategoriaGet(
        empresaId: number,
        slug: string,
    ): CancelablePromise<CategoryPageResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/public/home/home/categoria',
            query: {
                'empresa_id': empresaId,
                'slug': slug,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mercadopago Webhook Healthcheck
     * Endpoint simples para verificação do Mercado Pago.
     * @returns string Successful Response
     * @throws ApiError
     */
    public mercadopagoWebhookHealthcheckApiDeliveryPublicWebhooksPagamentosMercadopagoGet(): CancelablePromise<Record<string, string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/public/webhooks/pagamentos/mercadopago',
        });
    }
    /**
     * Mercadopago Webhook
     * @param id
     * @param topic
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public mercadopagoWebhookApiDeliveryPublicWebhooksPagamentosMercadopagoPost(
        id?: (string | null),
        topic?: (string | null),
        requestBody?: (MercadoPagoWebhookPayload | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/public/webhooks/pagamentos/mercadopago',
            query: {
                'id': id,
                'topic': topic,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Buscar Empresa Client
     * @param empresaId
     * @returns EmpresaClientOut Successful Response
     * @throws ApiError
     */
    public buscarEmpresaClientApiMensuraPublicEmpGet(
        empresaId: number,
    ): CancelablePromise<EmpresaClientOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/public/emp/',
            query: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
