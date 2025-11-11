/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConsultarTransacaoResponse } from '../models/ConsultarTransacaoResponse';
import type { EditarPedidoRequest } from '../models/EditarPedidoRequest';
import type { FinalizarPedidoRequest } from '../models/FinalizarPedidoRequest';
import type { ItemPedidoEditar } from '../models/ItemPedidoEditar';
import type { ModoEdicaoRequest } from '../models/ModoEdicaoRequest';
import { PagamentoGatewayEnum } from '../models/PagamentoGatewayEnum';
import { PagamentoMetodoEnum } from '../models/PagamentoMetodoEnum';
import type { PedidoResponse } from '../models/PedidoResponse';
import type { PedidoResponseSimplificado } from '../models/PedidoResponseSimplificado';
import type { PreviewCheckoutResponse } from '../models/PreviewCheckoutResponse';
import type { TransacaoResponse } from '../models/TransacaoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClientRotasDeClienteService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Preview Checkout
     * Calcula o preview do checkout (subtotal, taxas, desconto, total)
     * sem criar o pedido no banco de dados.
     *
     * Este endpoint é útil para mostrar ao cliente os valores antes de finalizar o pedido.
     * @param xSuperToken
     * @param requestBody
     * @returns PreviewCheckoutResponse Successful Response
     * @throws ApiError
     */
    public previewCheckoutApiCardapioClientPedidosCheckoutPreviewPost(
        xSuperToken: string,
        requestBody: FinalizarPedidoRequest,
    ): CancelablePromise<PreviewCheckoutResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/client/pedidos/checkout/preview',
            headers: {
                'x-super-token': xSuperToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Finalizar Checkout
     * Finaliza o checkout criando o pedido no banco de dados.
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public finalizarCheckoutApiCardapioClientPedidosCheckoutPost(
        xSuperToken: string,
        requestBody: FinalizarPedidoRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/client/pedidos/checkout',
            headers: {
                'x-super-token': xSuperToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Pedidos
     * Lista pedidos do cliente com dados simplificados incluindo nome do meio de pagamento
     * @param xSuperToken
     * @param skip
     * @param limit
     * @returns PedidoResponseSimplificado Successful Response
     * @throws ApiError
     */
    public listarPedidosApiCardapioClientPedidosGet(
        xSuperToken: string,
        skip?: number,
        limit: number = 50,
    ): CancelablePromise<Array<PedidoResponseSimplificado>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/client/pedidos/',
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Item Cliente
     * Atualiza itens de um pedido do cliente.
     *
     * - **pedido_id**: ID do pedido
     * - **item**: Objeto com a ação a ser executada (adicionar, atualizar, remover)
     * @param pedidoId ID do pedido
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarItemClienteApiCardapioClientPedidosPedidoIdItensPut(
        pedidoId: number,
        xSuperToken: string,
        requestBody: ItemPedidoEditar,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cardapio/client/pedidos/{pedido_id}/itens',
            path: {
                'pedido_id': pedidoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Pedido Cliente
     * ⚠️ DEPRECATED: Use o Gateway Orquestrador (/api/pedidos/{pedido_id}/editar)
     *
     * Este endpoint está sendo substituído pelo Gateway Orquestrador que unifica
     * endpoints de admin e client em um único endpoint.
     *
     * **Recomendado:** Use `PUT /api/pedidos/{pedido_id}/editar`
     *
     * Este endpoint será mantido apenas para compatibilidade retroativa.
     * @param pedidoId ID do pedido a ser atualizado
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarPedidoClienteApiCardapioClientPedidosPedidoIdEditarPut(
        pedidoId: number,
        xSuperToken: string,
        requestBody: EditarPedidoRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cardapio/client/pedidos/{pedido_id}/editar',
            path: {
                'pedido_id': pedidoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Alterar Modo Edicao
     * Altera o modo de edição do pedido.
     * True = ativa modo edição (status X), False = finaliza edição (status D)
     * @param pedidoId ID do pedido
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public alterarModoEdicaoApiCardapioClientPedidosPedidoIdModoEdicaoPut(
        pedidoId: number,
        xSuperToken: string,
        requestBody: ModoEdicaoRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cardapio/client/pedidos/{pedido_id}/modo-edicao',
            path: {
                'pedido_id': pedidoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirmar Pagamento
     * @param pedidoId ID do pedido
     * @param xSuperToken
     * @param metodo Método de pagamento
     * @param gateway Gateway de pagamento
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public confirmarPagamentoApiCardapioClientPagamentosPedidoIdConfirmarPost(
        pedidoId: number,
        xSuperToken: string,
        metodo: PagamentoMetodoEnum = PagamentoMetodoEnum.PIX,
        gateway: PagamentoGatewayEnum = PagamentoGatewayEnum.PIX_INTERNO,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/client/pagamentos/{pedido_id}/confirmar',
            path: {
                'pedido_id': pedidoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
                'metodo': metodo,
                'gateway': gateway,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Iniciar Pagamento
     * @param pedidoId ID do pedido
     * @param xSuperToken
     * @param metodo
     * @param gateway
     * @returns TransacaoResponse Successful Response
     * @throws ApiError
     */
    public iniciarPagamentoApiCardapioClientPagamentosPedidoIdPost(
        pedidoId: number,
        xSuperToken: string,
        metodo: PagamentoMetodoEnum = PagamentoMetodoEnum.PIX_ONLINE,
        gateway: PagamentoGatewayEnum = PagamentoGatewayEnum.MERCADOPAGO,
    ): CancelablePromise<TransacaoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/client/pagamentos/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
                'metodo': metodo,
                'gateway': gateway,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Consultar Pagamento
     * @param pedidoId ID do pedido
     * @param providerId ID da transação no provedor
     * @param xSuperToken
     * @param gateway
     * @returns ConsultarTransacaoResponse Successful Response
     * @throws ApiError
     */
    public consultarPagamentoApiCardapioClientPagamentosPedidoIdProviderIdGet(
        pedidoId: number,
        providerId: string,
        xSuperToken: string,
        gateway: PagamentoGatewayEnum = PagamentoGatewayEnum.MERCADOPAGO,
    ): CancelablePromise<ConsultarTransacaoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/client/pagamentos/{pedido_id}/{provider_id}',
            path: {
                'pedido_id': pedidoId,
                'provider_id': providerId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
                'gateway': gateway,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Endereco
     * Busca endereço com validação de CEP.
     * Se a query contém um CEP, primeiro consulta o ViaCEP para validar.
     * Depois complementa com busca no Geoapify para obter coordenadas.
     * @param text
     * @param xSuperToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public searchEnderecoApiClientGeoapifySearchEnderecoGet(
        text: string,
        xSuperToken: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/client/geoapify/search-endereco',
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
                'text': text,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
