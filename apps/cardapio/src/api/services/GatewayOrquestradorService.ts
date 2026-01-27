/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AcertosPassadosResponse } from '../models/AcertosPassadosResponse';
import type { AdicionalIn } from '../models/AdicionalIn';
import type { AdicionalOut } from '../models/AdicionalOut';
import type { AdicionalResponse } from '../models/AdicionalResponse';
import type { AdicionarItemRequest } from '../models/AdicionarItemRequest';
import type { AlterarStatusPedidoBody } from '../models/AlterarStatusPedidoBody';
import type { app__api__cadastros__schemas__schema_endereco__EnderecoCreate } from '../models/app__api__cadastros__schemas__schema_endereco__EnderecoCreate';
import type { app__api__cadastros__schemas__schema_endereco__EnderecoOut } from '../models/app__api__cadastros__schemas__schema_endereco__EnderecoOut';
import type { app__api__cardapio__schemas__schema_endereco__EnderecoCreate } from '../models/app__api__cardapio__schemas__schema_endereco__EnderecoCreate';
import type { app__api__cardapio__schemas__schema_endereco__EnderecoOut } from '../models/app__api__cardapio__schemas__schema_endereco__EnderecoOut';
import type { AtualizarAdicionalRequest } from '../models/AtualizarAdicionalRequest';
import type { AtualizarCategoriaRequest } from '../models/AtualizarCategoriaRequest';
import type { AtualizarObservacoesRequest } from '../models/AtualizarObservacoesRequest';
import type { AtualizarVitrineRequest } from '../models/AtualizarVitrineRequest';
import type { BannerParceiroIn } from '../models/BannerParceiroIn';
import type { BannerParceiroOut } from '../models/BannerParceiroOut';
import type { Body_atualizar_combo_api_cadastros_admin_combos__combo_id__put } from '../models/Body_atualizar_combo_api_cadastros_admin_combos__combo_id__put';
import type { Body_atualizar_imagem_categoria_api_cardapio_admin_categorias__categoria_id__imagem_patch } from '../models/Body_atualizar_imagem_categoria_api_cardapio_admin_categorias__categoria_id__imagem_patch';
import type { Body_atualizar_produto_api_cadastros_admin_produtos__cod_barras__put } from '../models/Body_atualizar_produto_api_cadastros_admin_produtos__cod_barras__put';
import type { Body_create_banner_api_cadastros_admin_parceiros_banners_post } from '../models/Body_create_banner_api_cadastros_admin_parceiros_banners_post';
import type { Body_create_empresa_api_cadastros_admin_empresas__post } from '../models/Body_create_empresa_api_cadastros_admin_empresas__post';
import type { Body_criar_combo_api_cadastros_admin_combos__post } from '../models/Body_criar_combo_api_cadastros_admin_combos__post';
import type { Body_criar_produto_api_cadastros_admin_produtos__post } from '../models/Body_criar_produto_api_cadastros_admin_produtos__post';
import type { Body_notificar_novo_pedido_api_notifications_pedidos_novo_pedido_post } from '../models/Body_notificar_novo_pedido_api_notifications_pedidos_novo_pedido_post';
import type { Body_publish_pedido_criado_api_notifications_events_pedido_criado_post } from '../models/Body_publish_pedido_criado_api_notifications_events_pedido_criado_post';
import type { Body_registrar_auditoria_api_notifications_historico_auditoria_post } from '../models/Body_registrar_auditoria_api_notifications_historico_auditoria_post';
import type { Body_send_bulk_notifications_rabbitmq_api_notifications_rabbitmq_send_bulk_notifications_post } from '../models/Body_send_bulk_notifications_rabbitmq_api_notifications_rabbitmq_send_bulk_notifications_post';
import type { Body_update_empresa_api_cadastros_admin_empresas__id__put } from '../models/Body_update_empresa_api_cadastros_admin_empresas__id__put';
import type { Body_update_ingrediente_api_mensura_admin_receitas_ingredientes__ingrediente_id__put } from '../models/Body_update_ingrediente_api_mensura_admin_receitas_ingredientes__ingrediente_id__put';
import type { CaixaConferenciaResumoResponse } from '../models/CaixaConferenciaResumoResponse';
import type { CaixaCreate } from '../models/CaixaCreate';
import type { CaixaFechamentoRequest } from '../models/CaixaFechamentoRequest';
import type { CaixaResponse } from '../models/CaixaResponse';
import type { CaixaResumoResponse } from '../models/CaixaResumoResponse';
import type { CaixaValoresEsperadosResponse } from '../models/CaixaValoresEsperadosResponse';
import type { CategoriaArvoreResponse } from '../models/CategoriaArvoreResponse';
import type { CategoriaDeliveryAdminIn } from '../models/CategoriaDeliveryAdminIn';
import type { CategoriaDeliveryAdminUpdate } from '../models/CategoriaDeliveryAdminUpdate';
import type { CategoriaDeliveryOut } from '../models/CategoriaDeliveryOut';
import type { CategoriaListItem } from '../models/CategoriaListItem';
import type { CategoriaResponse } from '../models/CategoriaResponse';
import type { CategoriaSearchOut } from '../models/CategoriaSearchOut';
import type { CategoriasPaginadasResponse } from '../models/CategoriasPaginadasResponse';
import type { CategoryPageResponse } from '../models/CategoryPageResponse';
import type { ClienteAdminUpdate } from '../models/ClienteAdminUpdate';
import type { ClienteCreate } from '../models/ClienteCreate';
import type { ClienteMeResponse } from '../models/ClienteMeResponse';
import type { ClienteOut } from '../models/ClienteOut';
import type { ClienteUpdate } from '../models/ClienteUpdate';
import type { ComboDTO } from '../models/ComboDTO';
import type { ConsultarTransacaoResponse } from '../models/ConsultarTransacaoResponse';
import type { CreateEventRequest } from '../models/CreateEventRequest';
import type { CreateNotificationRequest } from '../models/CreateNotificationRequest';
import type { CreateSubscriptionRequest } from '../models/CreateSubscriptionRequest';
import type { CriarAdicionalRequest } from '../models/CriarAdicionalRequest';
import type { CriarCategoriaRequest } from '../models/CriarCategoriaRequest';
import type { CriarNovoProdutoResponse } from '../models/CriarNovoProdutoResponse';
import type { CriarVitrineRequest } from '../models/CriarVitrineRequest';
import type { CupomCreate } from '../models/CupomCreate';
import type { CupomOut } from '../models/CupomOut';
import type { CupomUpdate } from '../models/CupomUpdate';
import type { EditarPedidoRequest } from '../models/EditarPedidoRequest';
import type { EmpresaCardapioLinkResponse } from '../models/EmpresaCardapioLinkResponse';
import type { EmpresaClientOut } from '../models/EmpresaClientOut';
import type { EmpresaResponse } from '../models/EmpresaResponse';
import type { EnderecoUpdate } from '../models/EnderecoUpdate';
import type { EntregadorCreate } from '../models/EntregadorCreate';
import type { EntregadorOut } from '../models/EntregadorOut';
import type { EntregadorUpdate } from '../models/EntregadorUpdate';
import type { EventListResponse } from '../models/EventListResponse';
import type { EventResponse } from '../models/EventResponse';
import type { FecharContaBalcaoRequest } from '../models/FecharContaBalcaoRequest';
import type { FecharContaMesaRequest } from '../models/FecharContaMesaRequest';
import type { FecharPedidosDiretoRequest } from '../models/FecharPedidosDiretoRequest';
import type { FecharPedidosDiretoResponse } from '../models/FecharPedidosDiretoResponse';
import type { FinalizarPedidoRequest } from '../models/FinalizarPedidoRequest';
import type { HistoricoDaMesaResponse } from '../models/HistoricoDaMesaResponse';
import type { HistoricoDoPedidoResponse } from '../models/HistoricoDoPedidoResponse';
import type { HistoricoPedidoBalcaoResponse } from '../models/HistoricoPedidoBalcaoResponse';
import type { HomeResponse } from '../models/HomeResponse';
import type { IngredienteIn } from '../models/IngredienteIn';
import type { IngredienteOut } from '../models/IngredienteOut';
import type { ItemPedidoEditar } from '../models/ItemPedidoEditar';
import type { KanbanAgrupadoResponse } from '../models/KanbanAgrupadoResponse';
import type { ListaCombosResponse } from '../models/ListaCombosResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { MeioPagamentoCreate } from '../models/MeioPagamentoCreate';
import type { MeioPagamentoResponse } from '../models/MeioPagamentoResponse';
import type { MeioPagamentoUpdate } from '../models/MeioPagamentoUpdate';
import type { MercadoPagoWebhookPayload } from '../models/MercadoPagoWebhookPayload';
import type { MesaIn } from '../models/MesaIn';
import type { MesaListOut } from '../models/MesaListOut';
import type { MesaOut } from '../models/MesaOut';
import type { MesaSearchOut } from '../models/MesaSearchOut';
import type { MesaStatsOut } from '../models/MesaStatsOut';
import type { MesaStatusUpdate } from '../models/MesaStatusUpdate';
import type { MesaUpdate } from '../models/MesaUpdate';
import type { ModoEdicaoRequest } from '../models/ModoEdicaoRequest';
import type { NotificationListResponse } from '../models/NotificationListResponse';
import type { NotificationLogResponse } from '../models/NotificationLogResponse';
import type { NotificationResponse } from '../models/NotificationResponse';
import type { NovoDispositivoRequest } from '../models/NovoDispositivoRequest';
import { PagamentoGatewayEnum } from '../models/PagamentoGatewayEnum';
import { PagamentoMetodoEnum } from '../models/PagamentoMetodoEnum';
import type { ParceiroCompletoOut } from '../models/ParceiroCompletoOut';
import type { ParceiroIn } from '../models/ParceiroIn';
import type { ParceiroOut } from '../models/ParceiroOut';
import type { PedidoBalcaoCreate } from '../models/PedidoBalcaoCreate';
import type { PedidoBalcaoOut } from '../models/PedidoBalcaoOut';
import type { PedidoMesaCreate } from '../models/PedidoMesaCreate';
import type { PedidoMesaOut } from '../models/PedidoMesaOut';
import type { PedidoPendenteAcertoOut } from '../models/PedidoPendenteAcertoOut';
import type { PedidoPendenteImpressaoResponse } from '../models/PedidoPendenteImpressaoResponse';
import type { PedidoResponse } from '../models/PedidoResponse';
import type { PedidoResponseCompletoTotal } from '../models/PedidoResponseCompletoTotal';
import type { PedidoResponseSimplificado } from '../models/PedidoResponseSimplificado';
import type { PedidoStatusEnum } from '../models/PedidoStatusEnum';
import type { PreviewAcertoResponse } from '../models/PreviewAcertoResponse';
import type { PreviewCheckoutResponse } from '../models/PreviewCheckoutResponse';
import type { ProdutosPaginadosResponse } from '../models/ProdutosPaginadosResponse';
import type { RegiaoEntregaCreate } from '../models/RegiaoEntregaCreate';
import type { RegiaoEntregaOut } from '../models/RegiaoEntregaOut';
import type { RegiaoEntregaUpdate } from '../models/RegiaoEntregaUpdate';
import type { RemoverItemResponse } from '../models/RemoverItemResponse';
import type { RespostaImpressaoPrinter } from '../models/RespostaImpressaoPrinter';
import type { SendNotificationRequest } from '../models/SendNotificationRequest';
import type { SetDiretivaRequest } from '../models/SetDiretivaRequest';
import type { SubscriptionListResponse } from '../models/SubscriptionListResponse';
import type { SubscriptionResponse } from '../models/SubscriptionResponse';
import type { ToggleHomeRequest } from '../models/ToggleHomeRequest';
import type { TokenResponse } from '../models/TokenResponse';
import type { TransacaoResponse } from '../models/TransacaoResponse';
import type { TransacaoStatusUpdateRequest } from '../models/TransacaoStatusUpdateRequest';
import type { UpdateSubscriptionRequest } from '../models/UpdateSubscriptionRequest';
import type { UserCreate } from '../models/UserCreate';
import type { UserResponse } from '../models/UserResponse';
import type { UserUpdate } from '../models/UserUpdate';
import type { VincularAdicionaisProdutoRequest } from '../models/VincularAdicionaisProdutoRequest';
import type { VinculoRequest } from '../models/VinculoRequest';
import type { VitrineComProdutosResponse } from '../models/VitrineComProdutosResponse';
import type { VitrineOut } from '../models/VitrineOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class GatewayOrquestradorService {
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
    public listarHomeApiCardapioPublicHomeHomeGet(
        empresaId: number,
        isHome: boolean,
    ): CancelablePromise<HomeResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/public/home/home',
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
    public listarVitrinesEProdutosPorCategoriaApiCardapioPublicHomeHomeVitrinePorCategoriaGet(
        empresaId: number,
        codCategoria?: (number | null),
        slug?: (string | null),
    ): CancelablePromise<Array<VitrineComProdutosResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/public/home/home/vitrine-por-categoria',
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
    public getCategoriaPageApiCardapioPublicHomeHomeCategoriaGet(
        empresaId: number,
        slug: string,
    ): CancelablePromise<CategoryPageResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/public/home/home/categoria',
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
    public mercadopagoWebhookHealthcheckApiCardapioPublicWebhooksPagamentosMercadopagoGet(): CancelablePromise<Record<string, string>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/public/webhooks/pagamentos/mercadopago',
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
    public mercadopagoWebhookApiCardapioPublicWebhooksPagamentosMercadopagoPost(
        id?: (string | null),
        topic?: (string | null),
        requestBody?: (MercadoPagoWebhookPayload | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/public/webhooks/pagamentos/mercadopago',
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
    public buscarEmpresaClientApiCadastrosPublicEmpGet(
        empresaId: number,
    ): CancelablePromise<EmpresaClientOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/public/emp/',
            query: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
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
     * Iniciar Pagameto
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
    /**
     * Listar Cupons
     * @param parceiroId
     * @returns CupomOut Successful Response
     * @throws ApiError
     */
    public listarCuponsApiDeliveryAdminCuponsGet(
        parceiroId?: (number | null),
    ): CancelablePromise<Array<CupomOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/admin/cupons',
            query: {
                'parceiro_id': parceiroId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Cupom
     * @param requestBody
     * @returns CupomOut Successful Response
     * @throws ApiError
     */
    public criarCupomApiDeliveryAdminCuponsPost(
        requestBody: CupomCreate,
    ): CancelablePromise<CupomOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/delivery/admin/cupons',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter Cupom
     * @param cupomId
     * @returns CupomOut Successful Response
     * @throws ApiError
     */
    public obterCupomApiDeliveryAdminCuponsCupomIdGet(
        cupomId: number,
    ): CancelablePromise<CupomOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/admin/cupons/{cupom_id}',
            path: {
                'cupom_id': cupomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Cupom
     * @param cupomId
     * @param requestBody
     * @returns CupomOut Successful Response
     * @throws ApiError
     */
    public atualizarCupomApiDeliveryAdminCuponsCupomIdPut(
        cupomId: number,
        requestBody: CupomUpdate,
    ): CancelablePromise<CupomOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/delivery/admin/cupons/{cupom_id}',
            path: {
                'cupom_id': cupomId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Cupom
     * @param cupomId
     * @returns void
     * @throws ApiError
     */
    public deletarCupomApiDeliveryAdminCuponsCupomIdDelete(
        cupomId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/delivery/admin/cupons/{cupom_id}',
            path: {
                'cupom_id': cupomId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter Por Codigo
     * @param codigo
     * @param empresaId
     * @returns CupomOut Successful Response
     * @throws ApiError
     */
    public obterPorCodigoApiDeliveryAdminCuponsByCodeCodigoGet(
        codigo: string,
        empresaId?: (number | null),
    ): CancelablePromise<CupomOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/delivery/admin/cupons/by-code/{codigo}',
            path: {
                'codigo': codigo,
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
     * Atualizar Status Pagamento
     * Atualiza o status do pagamento a partir de um evento externo (webhook/admin).
     * @param pedidoId ID do pedido
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarStatusPagamentoApiCardapioAdminPagamentosPedidoIdStatusPost(
        pedidoId: number,
        requestBody: TransacaoStatusUpdateRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/pagamentos/{pedido_id}/status',
            path: {
                'pedido_id': pedidoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Pedidos Admin Kanban
     * Lista pedidos do sistema para visualização no Kanban (admin).
     *
     * **Retorno agrupado por categoria:**
     * - `delivery`: Array de pedidos de delivery
     * - `balcao`: Array de pedidos de balcão
     * - `mesas`: Array de pedidos de mesas
     *
     * Cada categoria mantém seus IDs originais (sem conflitos).
     *
     * - **date_filter**: Filtra pedidos por data específica (formato YYYY-MM-DD)
     * - **empresa_id**: ID da empresa (obrigatório, deve ser maior que 0)
     * - **limit**: Limite de pedidos por categoria (padrão: 500)
     * @param empresaId ID da empresa para filtrar pedidos
     * @param dateFilter Filtrar pedidos por data (YYYY-MM-DD)
     * @param limit
     * @returns KanbanAgrupadoResponse Successful Response
     * @throws ApiError
     */
    public listarPedidosAdminKanbanApiCardapioAdminPedidosKanbanGet(
        empresaId: number,
        dateFilter?: (string | null),
        limit: number = 500,
    ): CancelablePromise<KanbanAgrupadoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/admin/pedidos/kanban',
            query: {
                'date_filter': dateFilter,
                'empresa_id': empresaId,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Pedido
     * Busca um pedido específico com informações completas (admin).
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     *
     * Retorna todos os dados do pedido incluindo itens, cliente, endereço, etc.
     * @param pedidoId ID do pedido
     * @returns PedidoResponseCompletoTotal Successful Response
     * @throws ApiError
     */
    public getPedidoApiCardapioAdminPedidosPedidoIdGet(
        pedidoId: number,
    ): CancelablePromise<PedidoResponseCompletoTotal> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/admin/pedidos/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Pedido
     * ⚠️ DEPRECATED: Use o Gateway Orquestrador (/api/pedidos/{pedido_id}/editar)
     *
     * Este endpoint está sendo substituído pelo Gateway Orquestrador que unifica
     * endpoints de admin e client em um único endpoint.
     *
     * **Recomendado:** Use `PUT /api/pedidos/{pedido_id}/editar`
     *
     * Este endpoint será mantido apenas para compatibilidade retroativa.
     *
     * Atualiza dados de um pedido existente (admin).
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     * - **payload**: Dados para atualização
     *
     * Campos que podem ser atualizados:
     * - **meio_pagamento_id**: ID do meio de pagamento
     * - **endereco_id**: ID do endereço de entrega
     * - **cupom_id**: ID do cupom de desconto
     * - **observacao_geral**: Observação geral do pedido
     * - **troco_para**: Valor do troco para
     * - **itens**: Lista de itens do pedido
     * @param pedidoId ID do pedido a ser atualizado
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarPedidoApiCardapioAdminPedidosPedidoIdPut(
        pedidoId: number,
        requestBody: EditarPedidoRequest,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cardapio/admin/pedidos/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Status Pedido
     * ⚠️ DEPRECATED: Use o Gateway Orquestrador (/api/pedidos/{pedido_id}/status)
     *
     * Este endpoint está sendo substituído pelo Gateway Orquestrador que unifica
     * endpoints de admin e client em um único endpoint.
     *
     * **Recomendado:** Use `PUT /api/pedidos/{pedido_id}/status?novo_status={status}`
     *
     * Este endpoint será mantido apenas para compatibilidade retroativa.
     *
     * Atualiza o status de um pedido (somente admin).
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     * - **novo_status**: Novo status do pedido (obrigatório)
     *
     * Status disponíveis: PENDENTE, CONFIRMADO, PREPARANDO, PRONTO, SAIU_PARA_ENTREGA, ENTREGUE, CANCELADO
     * @param pedidoId ID do pedido
     * @param novoStatus Novo status do pedido
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarStatusPedidoApiCardapioAdminPedidosStatusPedidoIdPut(
        pedidoId: number,
        novoStatus: PedidoStatusEnum,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cardapio/admin/pedidos/status/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            query: {
                'novo_status': novoStatus,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Alterar Status Pedido Com Historico
     * ⚠️ DEPRECATED: Use o Gateway Orquestrador (/api/pedidos/{pedido_id}/status)
     *
     * Este endpoint está sendo substituído pelo Gateway Orquestrador que unifica
     * endpoints de admin e client em um único endpoint.
     *
     * **Recomendado:** Use `PUT /api/pedidos/{pedido_id}/status` com payload completo
     *
     * Este endpoint será mantido apenas para compatibilidade retroativa.
     *
     * Altera o status de um pedido com histórico detalhado (admin).
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     * - **payload**: Dados para alteração do status incluindo motivo e observações
     *
     * Campos do payload:
     * - **status**: Novo status do pedido (obrigatório)
     * - **motivo**: Motivo da alteração (opcional)
     * - **observacoes**: Observações adicionais (opcional)
     * - **criado_por**: Quem fez a alteração (opcional, padrão: "admin")
     * - **ip_origem**: IP de origem (opcional)
     * - **user_agent**: User agent do cliente (opcional)
     * @param pedidoId ID do pedido
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public alterarStatusPedidoComHistoricoApiCardapioAdminPedidosStatusPedidoIdHistoricoPut(
        pedidoId: number,
        requestBody: AlterarStatusPedidoBody,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cardapio/admin/pedidos/status/{pedido_id}/historico',
            path: {
                'pedido_id': pedidoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter Historico Pedido
     * Obtém o histórico completo de alterações de status de um pedido.
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     *
     * Retorna todos os registros de mudança de status com timestamps, motivos e observações.
     * @param pedidoId ID do pedido
     * @returns HistoricoDoPedidoResponse Successful Response
     * @throws ApiError
     */
    public obterHistoricoPedidoApiCardapioAdminPedidosPedidoIdHistoricoGet(
        pedidoId: number,
    ): CancelablePromise<HistoricoDoPedidoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/admin/pedidos/{pedido_id}/historico',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Item
     * ⚠️ DEPRECATED: Use o Gateway Orquestrador (/api/pedidos/{pedido_id}/itens)
     *
     * Este endpoint está sendo substituído pelo Gateway Orquestrador que unifica
     * endpoints de admin e client em um único endpoint.
     *
     * **Recomendado:** Use `PUT /api/pedidos/{pedido_id}/itens`
     *
     * Este endpoint será mantido apenas para compatibilidade retroativa.
     *
     * Executa uma única ação sobre os itens do pedido (adicionar, atualizar ou remover).
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     * - **item**: Objeto descrevendo a ação a ser executada
     * @param pedidoId ID do pedido
     * @param requestBody
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public atualizarItemApiCardapioAdminPedidosPedidoIdItensPut(
        pedidoId: number,
        requestBody: ItemPedidoEditar,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cardapio/admin/pedidos/{pedido_id}/itens',
            path: {
                'pedido_id': pedidoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Vincular Entregador
     * Vincula ou desvincula um entregador a um pedido.
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     * - **entregador_id**: ID do entregador para vincular ou null para desvincular
     *
     * Para vincular: envie entregador_id com o ID do entregador
     * Para desvincular: envie entregador_id como null
     * @param pedidoId ID do pedido
     * @param entregadorId ID do entregador (omita para desvincular)
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public vincularEntregadorApiCardapioAdminPedidosPedidoIdEntregadorPut(
        pedidoId: number,
        entregadorId?: (number | null),
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cardapio/admin/pedidos/{pedido_id}/entregador',
            path: {
                'pedido_id': pedidoId,
            },
            query: {
                'entregador_id': entregadorId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Desvincular Entregador
     * Desvincula o entregador atual de um pedido.
     *
     * - **pedido_id**: ID do pedido (obrigatório, deve ser maior que 0)
     *
     * Remove a vinculação do entregador com o pedido.
     * @param pedidoId ID do pedido
     * @returns PedidoResponse Successful Response
     * @throws ApiError
     */
    public desvincularEntregadorApiCardapioAdminPedidosPedidoIdEntregadorDelete(
        pedidoId: number,
    ): CancelablePromise<PedidoResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cardapio/admin/pedidos/{pedido_id}/entregador',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Fechar Pedidos
     * Fecha pedidos por período (empresa obrigatória; entregador opcional).
     * @param requestBody
     * @returns FecharPedidosDiretoResponse Successful Response
     * @throws ApiError
     */
    public fecharPedidosApiFinanceiroAdminAcertosEntregadoresFecharPost(
        requestBody: FecharPedidosDiretoRequest,
    ): CancelablePromise<FecharPedidosDiretoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/financeiro/admin/acertos-entregadores/fechar',
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
    public listarPendentesApiFinanceiroAdminAcertosEntregadoresPendentesGet(
        empresaId: number,
        inicio: string,
        fim: string,
        entregadorId?: (number | null),
    ): CancelablePromise<Array<PedidoPendenteAcertoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/financeiro/admin/acertos-entregadores/pendentes',
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
    public previewAcertoApiFinanceiroAdminAcertosEntregadoresPreviewGet(
        empresaId: number,
        inicio: string,
        fim: string,
        entregadorId?: (number | null),
    ): CancelablePromise<PreviewAcertoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/financeiro/admin/acertos-entregadores/preview',
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
    public acertosPassadosApiFinanceiroAdminAcertosEntregadoresPassadosGet(
        empresaId: number,
        inicio: string,
        fim: string,
        entregadorId?: (number | null),
    ): CancelablePromise<AcertosPassadosResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/financeiro/admin/acertos-entregadores/passados',
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
     * Corrigir Permissoes Buckets
     * Corrige permissões de todos os buckets do MinIO para permitir acesso público às imagens.
     * Útil para resolver erros de "Access Denied" ao acessar imagens.
     * @returns any Successful Response
     * @throws ApiError
     */
    public corrigirPermissoesBucketsApiCardapioAdminMinioCorrigirPermissoesPost(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/minio/corrigir-permissoes',
        });
    }
    /**
     * Corrigir Bucket Empresa
     * Corrige permissões do bucket MinIO para uma empresa específica desconhecida.
     * @param empresaId
     * @returns any Successful Response
     * @throws ApiError
     */
    public corrigirBucketEmpresaApiCardapioAdminMinioCorrigirEmpresaEmpresaIdPost(
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/minio/corrigir-empresa/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Verificar Bucket Empresa
     * Verifica o status do bucket MinIO de uma empresa específica.
     * @param empresaId
     * @returns any Successful Response
     * @throws ApiError
     */
    public verificarBucketEmpresaApiCardapioAdminMinioVerificarBucketEmpresaIdGet(
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/admin/minio/verificar-bucket/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Categorias
     * @param codEmpresa
     * @param parentId Quando informado, retorna apenas as categorias filhas do ID informado.
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public listarCategoriasApiCardapioAdminCategoriasGet(
        codEmpresa: number,
        parentId?: (number | null),
    ): CancelablePromise<Array<CategoriaDeliveryOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/admin/categorias/',
            query: {
                'cod_empresa': codEmpresa,
                'parent_id': parentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Categoria
     * @param requestBody
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public criarCategoriaApiCardapioAdminCategoriasPost(
        requestBody: CategoriaDeliveryAdminIn,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/categorias/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Buscar Categorias
     * @param codEmpresa
     * @param q Termo de busca por descrição ou slug.
     * @param limit
     * @param offset
     * @returns CategoriaSearchOut Successful Response
     * @throws ApiError
     */
    public buscarCategoriasApiCardapioAdminCategoriasSearchGet(
        codEmpresa: number,
        q?: (string | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<CategoriaSearchOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/admin/categorias/search',
            query: {
                'cod_empresa': codEmpresa,
                'q': q,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter Categoria
     * @param categoriaId
     * @param codEmpresa
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public obterCategoriaApiCardapioAdminCategoriasCategoriaIdGet(
        categoriaId: number,
        codEmpresa: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/admin/categorias/{categoria_id}',
            path: {
                'categoria_id': categoriaId,
            },
            query: {
                'cod_empresa': codEmpresa,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Categoria
     * @param categoriaId
     * @param requestBody
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public atualizarCategoriaApiCardapioAdminCategoriasCategoriaIdPut(
        categoriaId: number,
        requestBody: CategoriaDeliveryAdminUpdate,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cardapio/admin/categorias/{categoria_id}',
            path: {
                'categoria_id': categoriaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Categoria
     * @param categoriaId
     * @param codEmpresa Identificador da empresa proprietária da categoria. Quando informado, remove também a imagem associada.
     * @returns void
     * @throws ApiError
     */
    public deletarCategoriaApiCardapioAdminCategoriasCategoriaIdDelete(
        categoriaId: number,
        codEmpresa: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cardapio/admin/categorias/{categoria_id}',
            path: {
                'categoria_id': categoriaId,
            },
            query: {
                'cod_empresa': codEmpresa,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Imagem Categoria
     * @param categoriaId
     * @param formData
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public atualizarImagemCategoriaApiCardapioAdminCategoriasCategoriaIdImagemPatch(
        categoriaId: number,
        formData: Body_atualizar_imagem_categoria_api_cardapio_admin_categorias__categoria_id__imagem_patch,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/cardapio/admin/categorias/{categoria_id}/imagem',
            path: {
                'categoria_id': categoriaId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mover Categoria Para Esquerda
     * @param categoriaId
     * @param codEmpresa
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public moverCategoriaParaEsquerdaApiCardapioAdminCategoriasCategoriaIdMoveLeftPost(
        categoriaId: number,
        codEmpresa: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/categorias/{categoria_id}/move-left',
            path: {
                'categoria_id': categoriaId,
            },
            query: {
                'cod_empresa': codEmpresa,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Mover Categoria Para Direita
     * @param categoriaId
     * @param codEmpresa
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public moverCategoriaParaDireitaApiCardapioAdminCategoriasCategoriaIdMoveRightPost(
        categoriaId: number,
        codEmpresa: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/categorias/{categoria_id}/move-right',
            path: {
                'categoria_id': categoriaId,
            },
            query: {
                'cod_empresa': codEmpresa,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Vitrines
     * @param empresaId
     * @param q Busca por título/slug
     * @param codCategoria Filtra por categoria vinculada
     * @param isHome Filtra por destaque da home
     * @param limit
     * @param offset
     * @returns VitrineOut Successful Response
     * @throws ApiError
     */
    public searchVitrinesApiCardapioAdminVitrinesSearchGet(
        empresaId: number,
        q?: (string | null),
        codCategoria?: (number | null),
        isHome?: (boolean | null),
        limit: number = 30,
        offset?: number,
    ): CancelablePromise<Array<VitrineOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/admin/vitrines/search',
            query: {
                'empresa_id': empresaId,
                'q': q,
                'cod_categoria': codCategoria,
                'is_home': isHome,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Toggle Home Vitrine
     * @param vitrineId ID da vitrine
     * @param empresaId
     * @param requestBody
     * @returns VitrineOut Successful Response
     * @throws ApiError
     */
    public toggleHomeVitrineApiCardapioAdminVitrinesVitrineIdHomePatch(
        vitrineId: number,
        empresaId: number,
        requestBody: ToggleHomeRequest,
    ): CancelablePromise<VitrineOut> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/cardapio/admin/vitrines/{vitrine_id}/home',
            path: {
                'vitrine_id': vitrineId,
            },
            query: {
                'empresa_id': empresaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Vitrine
     * @param requestBody
     * @returns VitrineOut Successful Response
     * @throws ApiError
     */
    public criarVitrineApiCardapioAdminVitrinesPost(
        requestBody: CriarVitrineRequest,
    ): CancelablePromise<VitrineOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/vitrines/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Vitrine
     * @param vitrineId ID da vitrine
     * @param empresaId
     * @param requestBody
     * @returns VitrineOut Successful Response
     * @throws ApiError
     */
    public atualizarVitrineApiCardapioAdminVitrinesVitrineIdPut(
        vitrineId: number,
        empresaId: number,
        requestBody: AtualizarVitrineRequest,
    ): CancelablePromise<VitrineOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cardapio/admin/vitrines/{vitrine_id}',
            path: {
                'vitrine_id': vitrineId,
            },
            query: {
                'empresa_id': empresaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Vitrine
     * @param vitrineId ID da vitrine
     * @param empresaId
     * @returns void
     * @throws ApiError
     */
    public deletarVitrineApiCardapioAdminVitrinesVitrineIdDelete(
        vitrineId: number,
        empresaId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cardapio/admin/vitrines/{vitrine_id}',
            path: {
                'vitrine_id': vitrineId,
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
     * Vincular Produto
     * @param vitrineId ID da vitrine
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public vincularProdutoApiCardapioAdminVitrinesVitrineIdVincularPost(
        vitrineId: number,
        requestBody: VinculoRequest,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cardapio/admin/vitrines/{vitrine_id}/vincular',
            path: {
                'vitrine_id': vitrineId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Desvincular Produto
     * @param vitrineId ID da vitrine
     * @param codBarras Código de barras do produto
     * @param empresaId Empresa do vínculo
     * @returns void
     * @throws ApiError
     */
    public desvincularProdutoApiCardapioAdminVitrinesVitrineIdVincularCodBarrasDelete(
        vitrineId: number,
        codBarras: string,
        empresaId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cardapio/admin/vitrines/{vitrine_id}/vincular/{cod_barras}',
            path: {
                'vitrine_id': vitrineId,
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
     * List Cardapio Links
     * @returns EmpresaCardapioLinkResponse Successful Response
     * @throws ApiError
     */
    public listCardapioLinksApiCadastrosAdminEmpresasCardapiosGet(): CancelablePromise<Array<EmpresaCardapioLinkResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/empresas/cardapios',
        });
    }
    /**
     * Create Empresa
     * @param formData
     * @returns EmpresaResponse Successful Response
     * @throws ApiError
     */
    public createEmpresaApiCadastrosAdminEmpresasPost(
        formData: Body_create_empresa_api_cadastros_admin_empresas__post,
    ): CancelablePromise<EmpresaResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/empresas/',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Empresas
     * @param skip
     * @param limit
     * @returns EmpresaResponse Successful Response
     * @throws ApiError
     */
    public listEmpresasApiCadastrosAdminEmpresasGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<EmpresaResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/empresas/',
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
     * Update Empresa
     * @param id
     * @param formData
     * @returns EmpresaResponse Successful Response
     * @throws ApiError
     */
    public updateEmpresaApiCadastrosAdminEmpresasIdPut(
        id: number,
        formData?: Body_update_empresa_api_cadastros_admin_empresas__id__put,
    ): CancelablePromise<EmpresaResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/empresas/{id}',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Empresa
     * @param id
     * @returns EmpresaResponse Successful Response
     * @throws ApiError
     */
    public getEmpresaApiCadastrosAdminEmpresasIdGet(
        id: number,
    ): CancelablePromise<EmpresaResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/empresas/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Empresa
     * @param id
     * @returns void
     * @throws ApiError
     */
    public deleteEmpresaApiCadastrosAdminEmpresasIdDelete(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/empresas/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create User
     * @param requestBody
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public createUserApiMensuraAdminUsuariosPost(
        requestBody: UserCreate,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mensura/admin/usuarios/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Users
     * @param skip
     * @param limit
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public listUsersApiMensuraAdminUsuariosGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<UserResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/usuarios/',
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
     * Get User
     * @param id
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public getUserApiMensuraAdminUsuariosIdGet(
        id: number,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/usuarios/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User
     * @param id
     * @param requestBody
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public updateUserApiMensuraAdminUsuariosIdPut(
        id: number,
        requestBody: UserUpdate,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/admin/usuarios/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * @param id
     * @returns void
     * @throws ApiError
     */
    public deleteUserApiMensuraAdminUsuariosIdDelete(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mensura/admin/usuarios/{id}',
            path: {
                'id': id,
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
     * @returns any Successful Response
     * @throws ApiError
     */
    public searchEnderecoApiAdminGeoapifySearchEnderecoGet(
        text: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/admin/geoapify/search-endereco',
            query: {
                'text': text,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Endereco
     * @param requestBody
     * @returns app__api__cadastros__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public createEnderecoApiMensuraAdminEnderecosPost(
        requestBody: app__api__cadastros__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<app__api__cadastros__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mensura/admin/enderecos/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Enderecos
     * @param skip
     * @param limit
     * @returns app__api__cadastros__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public listEnderecosApiMensuraAdminEnderecosGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<app__api__cadastros__schemas__schema_endereco__EnderecoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/enderecos/',
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
     * Get Endereco
     * @param id
     * @returns app__api__cadastros__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public getEnderecoApiMensuraAdminEnderecosIdGet(
        id: number,
    ): CancelablePromise<app__api__cadastros__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/enderecos/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Endereco
     * @param id
     * @param requestBody
     * @returns app__api__cadastros__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public updateEnderecoApiMensuraAdminEnderecosIdPut(
        id: number,
        requestBody: EnderecoUpdate,
    ): CancelablePromise<app__api__cadastros__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/admin/enderecos/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Endereco
     * @param id
     * @returns void
     * @throws ApiError
     */
    public deleteEnderecoApiMensuraAdminEnderecosIdDelete(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mensura/admin/enderecos/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Categoria
     * Cria uma nova categoria.
     *
     * - **descricao**: Descrição da categoria (obrigatório)
     * - **parent_id**: ID da categoria pai para subcategorias (opcional)
     * - **ativo**: Status ativo/inativo da categoria (padrão: True)
     * @param requestBody
     * @returns CategoriaResponse Successful Response
     * @throws ApiError
     */
    public criarCategoriaApiCadastrosAdminCategoriasPost(
        requestBody: CriarCategoriaRequest,
    ): CancelablePromise<CategoriaResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/categorias/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Categorias Paginado
     * Lista categorias com paginação.
     *
     * - **page**: Número da página (padrão: 1)
     * - **limit**: Itens por página (padrão: 10, máximo: 100)
     * - **apenas_ativas**: Filtrar apenas categorias ativas (padrão: True)
     * - **parent_id**: Filtrar por categoria pai (opcional)
     * @param page Número da página
     * @param limit Itens por página
     * @param apenasAtivas Filtrar apenas categorias ativas
     * @param parentId Filtrar por categoria pai
     * @returns CategoriasPaginadasResponse Successful Response
     * @throws ApiError
     */
    public listarCategoriasPaginadoApiCadastrosAdminCategoriasGet(
        page: number = 1,
        limit: number = 10,
        apenasAtivas: boolean = true,
        parentId?: (number | null),
    ): CancelablePromise<CategoriasPaginadasResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/categorias/',
            query: {
                'page': page,
                'limit': limit,
                'apenas_ativas': apenasAtivas,
                'parent_id': parentId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Buscar Categoria Por Id
     * Busca uma categoria específica por ID.
     * @param categoriaId
     * @returns CategoriaResponse Successful Response
     * @throws ApiError
     */
    public buscarCategoriaPorIdApiCadastrosAdminCategoriasCategoriaIdGet(
        categoriaId: number,
    ): CancelablePromise<CategoriaResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/categorias/{categoria_id}',
            path: {
                'categoria_id': categoriaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Categoria
     * Atualiza uma categoria existente.
     *
     * - **descricao**: Nova descrição da categoria (opcional)
     * - **parent_id**: Novo ID da categoria pai (opcional)
     * - **ativo**: Novo status ativo/inativo (opcional)
     * @param categoriaId
     * @param requestBody
     * @returns CategoriaResponse Successful Response
     * @throws ApiError
     */
    public atualizarCategoriaApiCadastrosAdminCategoriasCategoriaIdPut(
        categoriaId: number,
        requestBody: AtualizarCategoriaRequest,
    ): CancelablePromise<CategoriaResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/categorias/{categoria_id}',
            path: {
                'categoria_id': categoriaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Categoria
     * Deleta uma categoria (soft delete).
     *
     * **Nota**: Só é possível deletar categorias que não possuem subcategorias ativas.
     * @param categoriaId
     * @returns any Successful Response
     * @throws ApiError
     */
    public deletarCategoriaApiCadastrosAdminCategoriasCategoriaIdDelete(
        categoriaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/categorias/{categoria_id}',
            path: {
                'categoria_id': categoriaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Buscar Categorias Por Termo
     * Busca categorias por termo de pesquisa.
     *
     * - **termo**: Termo para buscar na descrição das categorias
     * - **page**: Número da página (padrão: 1)
     * - **limit**: Itens por página (padrão: 10, máximo: 100)
     * - **apenas_ativas**: Filtrar apenas categorias ativas (padrão: True)
     * @param termo Termo de busca
     * @param page Número da página
     * @param limit Itens por página
     * @param apenasAtivas Filtrar apenas categorias ativas
     * @returns CategoriasPaginadasResponse Successful Response
     * @throws ApiError
     */
    public buscarCategoriasPorTermoApiCadastrosAdminCategoriasBuscarTermoGet(
        termo: string,
        page: number = 1,
        limit: number = 10,
        apenasAtivas: boolean = true,
    ): CancelablePromise<CategoriasPaginadasResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/categorias/buscar/termo',
            query: {
                'termo': termo,
                'page': page,
                'limit': limit,
                'apenas_ativas': apenasAtivas,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Buscar Arvore Categorias
     * Busca todas as categorias organizadas em estrutura de árvore.
     *
     * - **apenas_ativas**: Filtrar apenas categorias ativas (padrão: True)
     * @param apenasAtivas Filtrar apenas categorias ativas
     * @returns CategoriaArvoreResponse Successful Response
     * @throws ApiError
     */
    public buscarArvoreCategoriasApiCadastrosAdminCategoriasArvoreEstruturaGet(
        apenasAtivas: boolean = true,
    ): CancelablePromise<CategoriaArvoreResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/categorias/arvore/estrutura',
            query: {
                'apenas_ativas': apenasAtivas,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Buscar Categorias Raiz
     * Busca apenas categorias raiz (sem categoria pai).
     *
     * - **apenas_ativas**: Filtrar apenas categorias ativas (padrão: True)
     * @param apenasAtivas Filtrar apenas categorias ativas
     * @returns CategoriaListItem Successful Response
     * @throws ApiError
     */
    public buscarCategoriasRaizApiCadastrosAdminCategoriasRaizListaGet(
        apenasAtivas: boolean = true,
    ): CancelablePromise<Array<CategoriaListItem>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/categorias/raiz/lista',
            query: {
                'apenas_ativas': apenasAtivas,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Buscar Filhos Da Categoria
     * Busca filhos de uma categoria específica.
     *
     * - **parent_id**: ID da categoria pai
     * - **apenas_ativas**: Filtrar apenas categorias ativas (padrão: True)
     * @param parentId
     * @param apenasAtivas Filtrar apenas categorias ativas
     * @returns CategoriaListItem Successful Response
     * @throws ApiError
     */
    public buscarFilhosDaCategoriaApiCadastrosAdminCategoriasParentIdFilhosGet(
        parentId: number,
        apenasAtivas: boolean = true,
    ): CancelablePromise<Array<CategoriaListItem>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/categorias/{parent_id}/filhos',
            path: {
                'parent_id': parentId,
            },
            query: {
                'apenas_ativas': apenasAtivas,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Diretiva
     * @param codBarras Código de barras do produto
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public setDiretivaApiMensuraAdminReceitasCodBarrasDiretivaPut(
        codBarras: string,
        requestBody: SetDiretivaRequest,
    ): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/admin/receitas/{cod_barras}/diretiva',
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
     * List Ingredientes
     * @param codBarras Código de barras do produto
     * @returns IngredienteOut Successful Response
     * @throws ApiError
     */
    public listIngredientesApiMensuraAdminReceitasCodBarrasIngredientesGet(
        codBarras: string,
    ): CancelablePromise<Array<IngredienteOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/receitas/{cod_barras}/ingredientes',
            path: {
                'cod_barras': codBarras,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Ingrediente
     * @param requestBody
     * @returns IngredienteOut Successful Response
     * @throws ApiError
     */
    public addIngredienteApiMensuraAdminReceitasIngredientesPost(
        requestBody: IngredienteIn,
    ): CancelablePromise<IngredienteOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mensura/admin/receitas/ingredientes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Ingrediente
     * @param ingredienteId
     * @param requestBody
     * @returns IngredienteOut Successful Response
     * @throws ApiError
     */
    public updateIngredienteApiMensuraAdminReceitasIngredientesIngredienteIdPut(
        ingredienteId: number,
        requestBody?: Body_update_ingrediente_api_mensura_admin_receitas_ingredientes__ingrediente_id__put,
    ): CancelablePromise<IngredienteOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/admin/receitas/ingredientes/{ingrediente_id}',
            path: {
                'ingrediente_id': ingredienteId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Ingrediente
     * @param ingredienteId
     * @returns void
     * @throws ApiError
     */
    public removeIngredienteApiMensuraAdminReceitasIngredientesIngredienteIdDelete(
        ingredienteId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mensura/admin/receitas/ingredientes/{ingrediente_id}',
            path: {
                'ingrediente_id': ingredienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Adicionais
     * @param codBarras
     * @returns AdicionalOut Successful Response
     * @throws ApiError
     */
    public listAdicionaisApiMensuraAdminReceitasCodBarrasAdicionaisGet(
        codBarras: string,
    ): CancelablePromise<Array<AdicionalOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/receitas/{cod_barras}/adicionais',
            path: {
                'cod_barras': codBarras,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Adicional
     * @param requestBody
     * @returns AdicionalOut Successful Response
     * @throws ApiError
     */
    public addAdicionalApiMensuraAdminReceitasAdicionaisPost(
        requestBody: AdicionalIn,
    ): CancelablePromise<AdicionalOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mensura/admin/receitas/adicionais',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Adicional
     * @param adicionalId
     * @param requestBody
     * @returns AdicionalOut Successful Response
     * @throws ApiError
     */
    public updateAdicionalApiMensuraAdminReceitasAdicionaisAdicionalIdPut(
        adicionalId: number,
        requestBody?: (number | null),
    ): CancelablePromise<AdicionalOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/admin/receitas/adicionais/{adicional_id}',
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
     * Remove Adicional
     * @param adicionalId
     * @returns void
     * @throws ApiError
     */
    public removeAdicionalApiMensuraAdminReceitasAdicionaisAdicionalIdDelete(
        adicionalId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mensura/admin/receitas/adicionais/{adicional_id}',
            path: {
                'adicional_id': adicionalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Relatorio Panoramico
     * @param inicio Início do período no formato YYYY-MM-DD
     * @param fim Fim do período no formato YYYY-MM-DD
     * @param empresaId Identificador da empresa
     * @returns any Successful Response
     * @throws ApiError
     */
    public relatorioPanoramicoApiRelatoriosAdminRelatoriosPanoramicoGet(
        inicio: string,
        fim: string,
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/relatorios/admin/relatorios/panoramico',
            query: {
                'inicio': inicio,
                'fim': fim,
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Relatorio Panoramico Diario
     * @param data Dia de referência (YYYY-MM-DD)
     * @param empresaId Identificador da empresa
     * @returns any Successful Response
     * @throws ApiError
     */
    public relatorioPanoramicoDiarioApiRelatoriosAdminRelatoriosPanoramicoDiaGet(
        data: string,
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/relatorios/admin/relatorios/panoramico-dia',
            query: {
                'data': data,
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Panoramico Ranking Bairro
     * @param inicio Início do período (YYYY-MM-DD)
     * @param fim Fim do período (YYYY-MM-DD)
     * @param empresaId Identificador da empresa
     * @param limite Quantidade de bairros no ranking
     * @returns any Successful Response
     * @throws ApiError
     */
    public panoramicoRankingBairroApiRelatoriosAdminRelatoriosPanoramicoRankingBairroGet(
        inicio: string,
        fim: string,
        empresaId: number,
        limite: number = 10,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/relatorios/admin/relatorios/panoramico/ranking-bairro',
            query: {
                'inicio': inicio,
                'fim': fim,
                'empresa_id': empresaId,
                'limite': limite,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Panoramico Ultimos 7 Dias
     * @param referencia Data de referência (YYYY-MM-DD) - inclui os 7 dias até ela
     * @param empresaId Identificador da empresa
     * @returns any Successful Response
     * @throws ApiError
     */
    public panoramicoUltimos7DiasApiRelatoriosAdminRelatoriosPanoramicoUltimos7DiasGet(
        referencia: string,
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/relatorios/admin/relatorios/panoramico/ultimos-7-dias',
            query: {
                'referencia': referencia,
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Panoramico Pico Hora
     * @param inicio Início do período (YYYY-MM-DD)
     * @param fim Fim do período (YYYY-MM-DD)
     * @param empresaId Identificador da empresa
     * @returns any Successful Response
     * @throws ApiError
     */
    public panoramicoPicoHoraApiRelatoriosAdminRelatoriosPanoramicoPicoHoraGet(
        inicio: string,
        fim: string,
        empresaId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/relatorios/admin/relatorios/panoramico/pico-hora',
            query: {
                'inicio': inicio,
                'fim': fim,
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Notification
     * Cria uma nova notificação
     * @param requestBody
     * @returns NotificationResponse Successful Response
     * @throws ApiError
     */
    public createNotificationApiNotificationsNotificationsPost(
        requestBody: CreateNotificationRequest,
    ): CancelablePromise<NotificationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/notifications/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Notifications
     * Lista notificações com filtros
     * @param empresaId ID da empresa
     * @param userId ID do usuário
     * @param eventType Tipo do evento
     * @param channel Canal de notificação
     * @param status Status da notificação
     * @param priority Prioridade
     * @param page Página
     * @param perPage Itens por página
     * @returns NotificationListResponse Successful Response
     * @throws ApiError
     */
    public listNotificationsApiNotificationsNotificationsGet(
        empresaId?: (string | null),
        userId?: (string | null),
        eventType?: (string | null),
        channel?: (string | null),
        status?: (string | null),
        priority?: (string | null),
        page: number = 1,
        perPage: number = 50,
    ): CancelablePromise<NotificationListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/notifications/',
            query: {
                'empresa_id': empresaId,
                'user_id': userId,
                'event_type': eventType,
                'channel': channel,
                'status': status,
                'priority': priority,
                'page': page,
                'per_page': perPage,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Send Notification
     * Envia notificação para múltiplos canais
     * @param requestBody
     * @returns string Successful Response
     * @throws ApiError
     */
    public sendNotificationApiNotificationsNotificationsSendPost(
        requestBody: SendNotificationRequest,
    ): CancelablePromise<Array<string>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/notifications/send',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Notification
     * Busca notificação por ID
     * @param notificationId
     * @returns NotificationResponse Successful Response
     * @throws ApiError
     */
    public getNotificationApiNotificationsNotificationsNotificationIdGet(
        notificationId: string,
    ): CancelablePromise<NotificationResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/notifications/{notification_id}',
            path: {
                'notification_id': notificationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Notification Logs
     * Busca logs de uma notificação
     * @param notificationId
     * @returns NotificationLogResponse Successful Response
     * @throws ApiError
     */
    public getNotificationLogsApiNotificationsNotificationsNotificationIdLogsGet(
        notificationId: string,
    ): CancelablePromise<Array<NotificationLogResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/notifications/{notification_id}/logs',
            path: {
                'notification_id': notificationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Process Pending Notifications
     * Processa notificações pendentes em background
     * @param limit Limite de notificações para processar
     * @returns any Successful Response
     * @throws ApiError
     */
    public processPendingNotificationsApiNotificationsNotificationsProcessPendingPost(
        limit: number = 50,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/notifications/process-pending',
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Retry Failed Notifications
     * Tenta reenviar notificações que falharam
     * @param limit Limite de notificações para reprocessar
     * @returns any Successful Response
     * @throws ApiError
     */
    public retryFailedNotificationsApiNotificationsNotificationsRetryFailedPost(
        limit: number = 50,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/notifications/retry-failed',
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Subscription
     * Cria uma nova assinatura de notificação
     * @param requestBody
     * @returns SubscriptionResponse Successful Response
     * @throws ApiError
     */
    public createSubscriptionApiNotificationsSubscriptionsPost(
        requestBody: CreateSubscriptionRequest,
    ): CancelablePromise<SubscriptionResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/subscriptions/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Subscriptions
     * Lista assinaturas com filtros
     * @param empresaId ID da empresa
     * @param userId ID do usuário
     * @param eventType Tipo do evento
     * @param channel Canal de notificação
     * @param active Status ativo
     * @param page Página
     * @param perPage Itens por página
     * @returns SubscriptionListResponse Successful Response
     * @throws ApiError
     */
    public listSubscriptionsApiNotificationsSubscriptionsGet(
        empresaId?: (string | null),
        userId?: (string | null),
        eventType?: (string | null),
        channel?: (string | null),
        active?: (boolean | null),
        page: number = 1,
        perPage: number = 50,
    ): CancelablePromise<SubscriptionListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/subscriptions/',
            query: {
                'empresa_id': empresaId,
                'user_id': userId,
                'event_type': eventType,
                'channel': channel,
                'active': active,
                'page': page,
                'per_page': perPage,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Subscription
     * Busca assinatura por ID
     * @param subscriptionId
     * @returns SubscriptionResponse Successful Response
     * @throws ApiError
     */
    public getSubscriptionApiNotificationsSubscriptionsSubscriptionIdGet(
        subscriptionId: string,
    ): CancelablePromise<SubscriptionResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/subscriptions/{subscription_id}',
            path: {
                'subscription_id': subscriptionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Subscription
     * Atualiza uma assinatura
     * @param subscriptionId
     * @param requestBody
     * @returns SubscriptionResponse Successful Response
     * @throws ApiError
     */
    public updateSubscriptionApiNotificationsSubscriptionsSubscriptionIdPut(
        subscriptionId: string,
        requestBody: UpdateSubscriptionRequest,
    ): CancelablePromise<SubscriptionResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/notifications/subscriptions/{subscription_id}',
            path: {
                'subscription_id': subscriptionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Subscription
     * Remove uma assinatura
     * @param subscriptionId
     * @returns any Successful Response
     * @throws ApiError
     */
    public deleteSubscriptionApiNotificationsSubscriptionsSubscriptionIdDelete(
        subscriptionId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/notifications/subscriptions/{subscription_id}',
            path: {
                'subscription_id': subscriptionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Toggle Subscription
     * Ativa/desativa uma assinatura
     * @param subscriptionId
     * @returns any Successful Response
     * @throws ApiError
     */
    public toggleSubscriptionApiNotificationsSubscriptionsSubscriptionIdTogglePost(
        subscriptionId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/subscriptions/{subscription_id}/toggle',
            path: {
                'subscription_id': subscriptionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Empresa Subscriptions
     * Busca assinaturas de uma empresa
     * @param empresaId
     * @param limit Limite de resultados
     * @param offset Offset
     * @returns SubscriptionResponse Successful Response
     * @throws ApiError
     */
    public getEmpresaSubscriptionsApiNotificationsSubscriptionsEmpresaEmpresaIdGet(
        empresaId: string,
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<SubscriptionResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/subscriptions/empresa/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User Subscriptions
     * Busca assinaturas de um usuário
     * @param userId
     * @param limit Limite de resultados
     * @param offset Offset
     * @returns SubscriptionResponse Successful Response
     * @throws ApiError
     */
    public getUserSubscriptionsApiNotificationsSubscriptionsUserUserIdGet(
        userId: string,
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<SubscriptionResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/subscriptions/user/{user_id}',
            path: {
                'user_id': userId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Supported Channels
     * Retorna lista de canais suportados
     * @returns any Successful Response
     * @throws ApiError
     */
    public getSupportedChannelsApiNotificationsSubscriptionsChannelsSupportedGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/subscriptions/channels/supported',
        });
    }
    /**
     * Test Channel Config
     * Testa configuração de um canal
     * @param channel
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public testChannelConfigApiNotificationsSubscriptionsChannelsTestPost(
        channel: string,
        requestBody: Record<string, any>,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/subscriptions/channels/test',
            query: {
                'channel': channel,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Subscription Statistics
     * Retorna estatísticas de assinaturas de uma empresa
     * @param empresaId
     * @returns any Successful Response
     * @throws ApiError
     */
    public getSubscriptionStatisticsApiNotificationsSubscriptionsStatisticsEmpresaIdGet(
        empresaId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/subscriptions/statistics/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Event
     * Cria um novo evento
     * @param requestBody
     * @returns EventResponse Successful Response
     * @throws ApiError
     */
    public createEventApiNotificationsEventsPost(
        requestBody: CreateEventRequest,
    ): CancelablePromise<EventResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/events/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Events
     * Lista eventos com filtros
     * @param empresaId ID da empresa
     * @param eventType Tipo do evento
     * @param processed Status de processamento
     * @param page Página
     * @param perPage Itens por página
     * @returns EventListResponse Successful Response
     * @throws ApiError
     */
    public listEventsApiNotificationsEventsGet(
        empresaId?: (string | null),
        eventType?: (string | null),
        processed?: (boolean | null),
        page: number = 1,
        perPage: number = 50,
    ): CancelablePromise<EventListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/events/',
            query: {
                'empresa_id': empresaId,
                'event_type': eventType,
                'processed': processed,
                'page': page,
                'per_page': perPage,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Publish Pedido Criado
     * Publica evento de pedido criado
     * @param empresaId
     * @param pedidoId
     * @param valorTotal
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public publishPedidoCriadoApiNotificationsEventsPedidoCriadoPost(
        empresaId: string,
        pedidoId: string,
        valorTotal: number,
        formData: Body_publish_pedido_criado_api_notifications_events_pedido_criado_post,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/events/pedido-criado',
            query: {
                'empresa_id': empresaId,
                'pedido_id': pedidoId,
                'valor_total': valorTotal,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Publish Pedido Aprovado
     * Publica evento de pedido aprovado
     * @param empresaId
     * @param pedidoId
     * @param aprovadoPor
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public publishPedidoAprovadoApiNotificationsEventsPedidoAprovadoPost(
        empresaId: string,
        pedidoId: string,
        aprovadoPor: string,
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/events/pedido-aprovado',
            query: {
                'empresa_id': empresaId,
                'pedido_id': pedidoId,
                'aprovado_por': aprovadoPor,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Publish Estoque Baixo
     * Publica evento de estoque baixo
     * @param empresaId
     * @param produtoId
     * @param produtoNome
     * @param quantidadeAtual
     * @param quantidadeMinima
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public publishEstoqueBaixoApiNotificationsEventsEstoqueBaixoPost(
        empresaId: string,
        produtoId: string,
        produtoNome: string,
        quantidadeAtual: number,
        quantidadeMinima: number,
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/events/estoque-baixo',
            query: {
                'empresa_id': empresaId,
                'produto_id': produtoId,
                'produto_nome': produtoNome,
                'quantidade_atual': quantidadeAtual,
                'quantidade_minima': quantidadeMinima,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Publish Pagamento Aprovado
     * Publica evento de pagamento aprovado
     * @param empresaId
     * @param pagamentoId
     * @param pedidoId
     * @param valor
     * @param metodoPagamento
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public publishPagamentoAprovadoApiNotificationsEventsPagamentoAprovadoPost(
        empresaId: string,
        pagamentoId: string,
        pedidoId: string,
        valor: number,
        metodoPagamento: string,
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/events/pagamento-aprovado',
            query: {
                'empresa_id': empresaId,
                'pagamento_id': pagamentoId,
                'pedido_id': pedidoId,
                'valor': valor,
                'metodo_pagamento': metodoPagamento,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Event
     * Busca evento por ID
     * @param eventId
     * @returns EventResponse Successful Response
     * @throws ApiError
     */
    public getEventApiNotificationsEventsEventIdGet(
        eventId: string,
    ): CancelablePromise<EventResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/events/{event_id}',
            path: {
                'event_id': eventId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Empresa Events
     * Busca eventos de uma empresa
     * @param empresaId
     * @param limit Limite de resultados
     * @param offset Offset
     * @returns EventResponse Successful Response
     * @throws ApiError
     */
    public getEmpresaEventsApiNotificationsEventsEmpresaEmpresaIdGet(
        empresaId: string,
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<Array<EventResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/events/empresa/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Event Statistics
     * Retorna estatísticas de eventos de uma empresa
     * @param empresaId
     * @param days Período em dias
     * @returns any Successful Response
     * @throws ApiError
     */
    public getEventStatisticsApiNotificationsEventsStatisticsEmpresaIdGet(
        empresaId: string,
        days: number = 30,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/events/statistics/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            query: {
                'days': days,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Notificar Novo Pedido
     * Notifica sobre um novo pedido criado
     *
     * Este endpoint deve ser chamado sempre que um novo pedido for criado no sistema.
     * Ele irá:
     * 1. Publicar um evento no sistema de eventos
     * 2. Processar assinaturas de notificação configuradas
     * @param empresaId
     * @param pedidoId
     * @param valorTotal
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public notificarNovoPedidoApiNotificationsPedidosNovoPedidoPost(
        empresaId: string,
        pedidoId: string,
        valorTotal: number,
        formData: Body_notificar_novo_pedido_api_notifications_pedidos_novo_pedido_post,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/pedidos/novo-pedido',
            query: {
                'empresa_id': empresaId,
                'pedido_id': pedidoId,
                'valor_total': valorTotal,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Notificar Pedido Aprovado
     * Notifica sobre pedido aprovado
     * @param empresaId
     * @param pedidoId
     * @param aprovadoPor
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public notificarPedidoAprovadoApiNotificationsPedidosPedidoAprovadoPost(
        empresaId: string,
        pedidoId: string,
        aprovadoPor: string,
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/pedidos/pedido-aprovado',
            query: {
                'empresa_id': empresaId,
                'pedido_id': pedidoId,
                'aprovado_por': aprovadoPor,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Notificar Pedido Cancelado
     * Notifica sobre pedido cancelado
     * @param empresaId
     * @param pedidoId
     * @param motivo
     * @param canceladoPor
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public notificarPedidoCanceladoApiNotificationsPedidosPedidoCanceladoPost(
        empresaId: string,
        pedidoId: string,
        motivo: string,
        canceladoPor: string,
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/pedidos/pedido-cancelado',
            query: {
                'empresa_id': empresaId,
                'pedido_id': pedidoId,
                'motivo': motivo,
                'cancelado_por': canceladoPor,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Notificar Pedido Entregue
     * Notifica sobre pedido entregue
     * @param empresaId
     * @param pedidoId
     * @param entreguePor
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public notificarPedidoEntregueApiNotificationsPedidosPedidoEntreguePost(
        empresaId: string,
        pedidoId: string,
        entreguePor: string,
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/pedidos/pedido-entregue',
            query: {
                'empresa_id': empresaId,
                'pedido_id': pedidoId,
                'entregue_por': entreguePor,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Registrar Mudanca Status Pedido
     * Registra mudança de status de pedido no histórico
     * @param empresaId
     * @param pedidoId
     * @param statusAnterior
     * @param statusNovo
     * @param usuarioId
     * @param motivo
     * @returns any Successful Response
     * @throws ApiError
     */
    public registrarMudancaStatusPedidoApiNotificationsHistoricoPedidoStatusChangePost(
        empresaId: string,
        pedidoId: string,
        statusAnterior: string,
        statusNovo: string,
        usuarioId: string,
        motivo?: (string | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/historico/pedido/status-change',
            query: {
                'empresa_id': empresaId,
                'pedido_id': pedidoId,
                'status_anterior': statusAnterior,
                'status_novo': statusNovo,
                'usuario_id': usuarioId,
                'motivo': motivo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Registrar Login Usuario
     * Registra login de usuário no histórico
     * @param empresaId
     * @param userId
     * @param ipAddress
     * @param userAgent
     * @returns any Successful Response
     * @throws ApiError
     */
    public registrarLoginUsuarioApiNotificationsHistoricoUsuarioLoginPost(
        empresaId: string,
        userId: string,
        ipAddress?: (string | null),
        userAgent?: (string | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/historico/usuario/login',
            query: {
                'empresa_id': empresaId,
                'user_id': userId,
                'ip_address': ipAddress,
                'user_agent': userAgent,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Registrar Logout Usuario
     * Registra logout de usuário no histórico
     * @param empresaId
     * @param userId
     * @param sessionDuration
     * @returns any Successful Response
     * @throws ApiError
     */
    public registrarLogoutUsuarioApiNotificationsHistoricoUsuarioLogoutPost(
        empresaId: string,
        userId: string,
        sessionDuration?: (number | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/historico/usuario/logout',
            query: {
                'empresa_id': empresaId,
                'user_id': userId,
                'session_duration': sessionDuration,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Registrar Log Sistema
     * Registra log do sistema no histórico
     * @param empresaId
     * @param modulo
     * @param nivel
     * @param mensagem
     * @param erro
     * @param stackTrace
     * @returns any Successful Response
     * @throws ApiError
     */
    public registrarLogSistemaApiNotificationsHistoricoSistemaLogPost(
        empresaId: string,
        modulo: string,
        nivel: string,
        mensagem: string,
        erro?: (string | null),
        stackTrace?: (string | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/historico/sistema/log',
            query: {
                'empresa_id': empresaId,
                'modulo': modulo,
                'nivel': nivel,
                'mensagem': mensagem,
                'erro': erro,
                'stack_trace': stackTrace,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Registrar Auditoria
     * Registra evento de auditoria no histórico
     * @param empresaId
     * @param usuarioId
     * @param acao
     * @param recurso
     * @param recursoId
     * @param ipAddress
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public registrarAuditoriaApiNotificationsHistoricoAuditoriaPost(
        empresaId: string,
        usuarioId: string,
        acao: string,
        recurso: string,
        recursoId: string,
        ipAddress?: (string | null),
        requestBody?: Body_registrar_auditoria_api_notifications_historico_auditoria_post,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/historico/auditoria',
            query: {
                'empresa_id': empresaId,
                'usuario_id': usuarioId,
                'acao': acao,
                'recurso': recurso,
                'recurso_id': recursoId,
                'ip_address': ipAddress,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Historico Empresa
     * Busca histórico completo da empresa
     * @param empresaId
     * @param dataInicio Data de início (ISO format)
     * @param dataFim Data de fim (ISO format)
     * @param tiposEvento Tipos de evento para filtrar
     * @param limit Limite de resultados
     * @param offset Offset para paginação
     * @returns any Successful Response
     * @throws ApiError
     */
    public getHistoricoEmpresaApiNotificationsHistoricoEmpresaEmpresaIdGet(
        empresaId: string,
        dataInicio?: (string | null),
        dataFim?: (string | null),
        tiposEvento?: (Array<string> | null),
        limit: number = 100,
        offset?: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/historico/empresa/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            query: {
                'data_inicio': dataInicio,
                'data_fim': dataFim,
                'tipos_evento': tiposEvento,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Historico Pedido
     * Busca histórico completo de um pedido
     * @param pedidoId
     * @param empresaId
     * @returns any Successful Response
     * @throws ApiError
     */
    public getHistoricoPedidoApiNotificationsHistoricoPedidoPedidoIdGet(
        pedidoId: string,
        empresaId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/historico/pedido/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
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
     * Get Historico Usuario
     * Busca histórico completo de um usuário
     * @param userId
     * @param empresaId
     * @param dataInicio Data de início (ISO format)
     * @param dataFim Data de fim (ISO format)
     * @returns any Successful Response
     * @throws ApiError
     */
    public getHistoricoUsuarioApiNotificationsHistoricoUsuarioUserIdGet(
        userId: string,
        empresaId: string,
        dataInicio?: (string | null),
        dataFim?: (string | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/historico/usuario/{user_id}',
            path: {
                'user_id': userId,
            },
            query: {
                'empresa_id': empresaId,
                'data_inicio': dataInicio,
                'data_fim': dataFim,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Estatisticas Empresa
     * Busca estatísticas da empresa
     * @param empresaId
     * @param dataInicio Data de início (ISO format)
     * @param dataFim Data de fim (ISO format)
     * @returns any Successful Response
     * @throws ApiError
     */
    public getEstatisticasEmpresaApiNotificationsHistoricoEstatisticasEmpresaIdGet(
        empresaId: string,
        dataInicio?: (string | null),
        dataFim?: (string | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/historico/estatisticas/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            query: {
                'data_inicio': dataInicio,
                'data_fim': dataFim,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Dashboard Empresa
     * Busca dados para dashboard da empresa
     * @param empresaId
     * @param periodoDias Período em dias
     * @returns any Successful Response
     * @throws ApiError
     */
    public getDashboardEmpresaApiNotificationsHistoricoDashboardEmpresaIdGet(
        empresaId: string,
        periodoDias: number = 30,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/historico/dashboard/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            query: {
                'periodo_dias': periodoDias,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Executar Migracao Historicos
     * Executa migração de dados antigos para o sistema unificado
     * @param removerAntigas Remove tabelas antigas após migração
     * @returns any Successful Response
     * @throws ApiError
     */
    public executarMigracaoHistoricosApiNotificationsHistoricoMigrarPost(
        removerAntigas: boolean = false,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/historico/migrar',
            query: {
                'remover_antigas': removerAntigas,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Status Migracao
     * Verifica status da migração
     * @returns any Successful Response
     * @throws ApiError
     */
    public statusMigracaoApiNotificationsHistoricoMigracaoStatusGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/historico/migracao/status',
        });
    }
    /**
     * Get Rabbitmq Status
     * Retorna status do RabbitMQ
     * @returns any Successful Response
     * @throws ApiError
     */
    public getRabbitmqStatusApiNotificationsRabbitmqStatusGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/rabbitmq/status',
        });
    }
    /**
     * Send Notification Rabbitmq
     * Envia notificação via RabbitMQ
     * @param empresaId
     * @param userId
     * @param eventType
     * @param title
     * @param message
     * @param channel
     * @param recipient
     * @param priority
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public sendNotificationRabbitmqApiNotificationsRabbitmqSendNotificationPost(
        empresaId: string,
        userId: (string | null),
        eventType: string,
        title: string,
        message: string,
        channel: string,
        recipient: string,
        priority: string = 'normal',
        requestBody?: (Record<string, any> | null),
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/rabbitmq/send-notification',
            query: {
                'empresa_id': empresaId,
                'user_id': userId,
                'event_type': eventType,
                'title': title,
                'message': message,
                'channel': channel,
                'recipient': recipient,
                'priority': priority,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Send Bulk Notifications Rabbitmq
     * Envia notificações em lote via RabbitMQ
     * @param empresaId
     * @param eventType
     * @param title
     * @param message
     * @param requestBody
     * @param priority
     * @returns any Successful Response
     * @throws ApiError
     */
    public sendBulkNotificationsRabbitmqApiNotificationsRabbitmqSendBulkNotificationsPost(
        empresaId: string,
        eventType: string,
        title: string,
        message: string,
        requestBody: Body_send_bulk_notifications_rabbitmq_api_notifications_rabbitmq_send_bulk_notifications_post,
        priority: string = 'normal',
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/rabbitmq/send-bulk-notifications',
            query: {
                'empresa_id': empresaId,
                'event_type': eventType,
                'title': title,
                'message': message,
                'priority': priority,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Notification Status
     * Busca status de uma notificação
     * @param notificationId
     * @returns any Successful Response
     * @throws ApiError
     */
    public getNotificationStatusApiNotificationsRabbitmqNotificationNotificationIdStatusGet(
        notificationId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/rabbitmq/notification/{notification_id}/status',
            path: {
                'notification_id': notificationId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Retry Failed Notifications
     * Tenta reenviar notificações que falharam via RabbitMQ
     * @param limit Limite de notificações para reprocessar
     * @returns any Successful Response
     * @throws ApiError
     */
    public retryFailedNotificationsApiNotificationsRabbitmqRetryFailedPost(
        limit: number = 50,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/rabbitmq/retry-failed',
            query: {
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Rabbitmq Queues
     * Lista queues do RabbitMQ
     * @returns any Successful Response
     * @throws ApiError
     */
    public getRabbitmqQueuesApiNotificationsRabbitmqQueuesGet(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/notifications/rabbitmq/queues',
        });
    }
    /**
     * Test Rabbitmq Connection
     * Testa conexão com RabbitMQ
     * @returns any Successful Response
     * @throws ApiError
     */
    public testRabbitmqConnectionApiNotificationsRabbitmqTestConnectionPost(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/notifications/rabbitmq/test-connection',
        });
    }
    /**
     * Abrir Caixa
     * Abre um novo caixa para a empresa.
     *
     * - **empresa_id**: ID da empresa (obrigatório)
     * - **valor_inicial**: Valor em dinheiro no caixa (obrigatório, >= 0)
     * - **observacoes_abertura**: Observações opcionais
     *
     * Não permite abrir um novo caixa se já existir um caixa aberto para a empresa.
     * @param requestBody
     * @returns CaixaResponse Successful Response
     * @throws ApiError
     */
    public abrirCaixaApiCaixaAdminCaixasAbrirPost(
        requestBody: CaixaCreate,
    ): CancelablePromise<CaixaResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/caixa/admin/caixas/abrir',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Fechar Caixa
     * Fecha um caixa aberto.
     *
     * - **caixa_id**: ID do caixa (obrigatório)
     * - **saldo_real**: Valor real contado no fechamento para dinheiro físico (obrigatório, >= 0)
     * - **observacoes_fechamento**: Observações opcionais
     * - **conferencias**: Lista de conferências por tipo de meio de pagamento (opcional)
     * - Cada conferência deve ter: meio_pagamento_id, valor_conferido, observacoes (opcional)
     *
     * Calcula automaticamente o saldo esperado e a diferença entre esperado e real.
     * Para cada meio de pagamento informado, calcula e salva a diferença entre valor esperado e conferido.
     * @param caixaId ID do caixa a ser fechado
     * @param requestBody
     * @returns CaixaResponse Successful Response
     * @throws ApiError
     */
    public fecharCaixaApiCaixaAdminCaixasCaixaIdFecharPost(
        caixaId: number,
        requestBody: CaixaFechamentoRequest,
    ): CancelablePromise<CaixaResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/caixa/admin/caixas/{caixa_id}/fechar',
            path: {
                'caixa_id': caixaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Caixa
     * Busca um caixa específico por ID com todas as informações.
     * @param caixaId ID do caixa
     * @returns CaixaResponse Successful Response
     * @throws ApiError
     */
    public getCaixaApiCaixaAdminCaixasCaixaIdGet(
        caixaId: number,
    ): CancelablePromise<CaixaResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/caixa/admin/caixas/{caixa_id}',
            path: {
                'caixa_id': caixaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Caixa Aberto
     * Busca o caixa aberto de uma empresa.
     * Retorna 404 se não houver caixa aberto.
     * @param empresaId ID da empresa
     * @returns CaixaResponse Successful Response
     * @throws ApiError
     */
    public getCaixaAbertoApiCaixaAdminCaixasAbertoEmpresaIdGet(
        empresaId: number,
    ): CancelablePromise<CaixaResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/caixa/admin/caixas/aberto/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Caixas
     * Lista caixas com filtros opcionais.
     *
     * Filtros disponíveis:
     * - **empresa_id**: Filtrar por empresa
     * - **status**: Filtrar por status (ABERTO/FECHADO)
     * - **data_inicio**: Data de início para filtrar por data de abertura
     * - **data_fim**: Data de fim para filtrar por data de abertura
     * @param empresaId Filtrar por empresa
     * @param status Filtrar por status (ABERTO/FECHADO)
     * @param dataInicio Data início (YYYY-MM-DD)
     * @param dataFim Data fim (YYYY-MM-DD)
     * @param skip Número de registros para pular
     * @param limit Limite de registros
     * @returns CaixaResumoResponse Successful Response
     * @throws ApiError
     */
    public listarCaixasApiCaixaAdminCaixasGet(
        empresaId?: (number | null),
        status?: (string | null),
        dataInicio?: (string | null),
        dataFim?: (string | null),
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<CaixaResumoResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/caixa/admin/caixas/',
            query: {
                'empresa_id': empresaId,
                'status': status,
                'data_inicio': dataInicio,
                'data_fim': dataFim,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Recalcular Saldo
     * Recalcula o saldo esperado do caixa baseado em:
     * - Valor inicial
     * + Entradas (pedidos pagos em dinheiro desde a abertura)
     * - Saídas (trocos dados desde a abertura)
     *
     * Só funciona para caixas abertos.
     * @param caixaId ID do caixa
     * @returns CaixaResponse Successful Response
     * @throws ApiError
     */
    public recalcularSaldoApiCaixaAdminCaixasCaixaIdRecalcularSaldoPost(
        caixaId: number,
    ): CancelablePromise<CaixaResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/caixa/admin/caixas/{caixa_id}/recalcular-saldo',
            path: {
                'caixa_id': caixaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Valores Esperados
     * Retorna valores esperados por tipo de meio de pagamento para um caixa aberto.
     *
     * Útil antes do fechamento para conferência. Mostra:
     * - Valor inicial em dinheiro
     * - Valores esperados por cada meio de pagamento usado
     * - Quantidade de transações por meio de pagamento
     * - Total esperado em dinheiro (valor inicial + entradas - saídas)
     *
     * Só funciona para caixas abertos.
     * @param caixaId ID do caixa aberto
     * @returns CaixaValoresEsperadosResponse Successful Response
     * @throws ApiError
     */
    public getValoresEsperadosApiCaixaAdminCaixasCaixaIdValoresEsperadosGet(
        caixaId: number,
    ): CancelablePromise<CaixaValoresEsperadosResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/caixa/admin/caixas/{caixa_id}/valores-esperados',
            path: {
                'caixa_id': caixaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Conferencias
     * Retorna todas as conferências de um caixa fechado.
     *
     * Mostra para cada meio de pagamento:
     * - Valor esperado (calculado automaticamente)
     * - Valor conferido (informado no fechamento)
     * - Diferença entre esperado e conferido
     * - Quantidade de transações
     * - Observações
     * @param caixaId ID do caixa
     * @returns CaixaConferenciaResumoResponse Successful Response
     * @throws ApiError
     */
    public getConferenciasApiCaixaAdminCaixasCaixaIdConferenciasGet(
        caixaId: number,
    ): CancelablePromise<CaixaConferenciaResumoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/caixa/admin/caixas/{caixa_id}/conferencias',
            path: {
                'caixa_id': caixaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Mesa Stats
     * Retorna estatísticas das mesas
     * @returns MesaStatsOut Successful Response
     * @throws ApiError
     */
    public getMesaStatsApiMesasAdminMesasStatsGet(): CancelablePromise<MesaStatsOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/mesas/stats',
        });
    }
    /**
     * Search Mesas
     * Busca mesas com filtros
     * @param q Termo de busca por número/descrição
     * @param ativa Filtrar por status ativo
     * @param limit
     * @param offset
     * @returns MesaSearchOut Successful Response
     * @throws ApiError
     */
    public searchMesasApiMesasAdminMesasSearchGet(
        q?: (string | null),
        ativa?: (boolean | null),
        limit: number = 30,
        offset?: number,
    ): CancelablePromise<Array<MesaSearchOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/mesas/search',
            query: {
                'q': q,
                'ativa': ativa,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Mesas
     * Lista todas as mesas
     * @param ativa Filtrar por status ativo
     * @returns MesaListOut Successful Response
     * @throws ApiError
     */
    public listMesasApiMesasAdminMesasGet(
        ativa?: (boolean | null),
    ): CancelablePromise<Array<MesaListOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/mesas',
            query: {
                'ativa': ativa,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Mesa
     * Cria uma nova mesa
     * @param requestBody
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public criarMesaApiMesasAdminMesasPost(
        requestBody: MesaIn,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/mesas',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Mesa
     * Busca mesa por ID
     * @param mesaId
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public getMesaApiMesasAdminMesasMesaIdGet(
        mesaId: number,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/mesas/{mesa_id}',
            path: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Mesa
     * Atualiza uma mesa
     * @param mesaId
     * @param requestBody
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public atualizarMesaApiMesasAdminMesasMesaIdPut(
        mesaId: number,
        requestBody: MesaUpdate,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mesas/admin/mesas/{mesa_id}',
            path: {
                'mesa_id': mesaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Mesa
     * Deleta uma mesa
     * @param mesaId
     * @returns void
     * @throws ApiError
     */
    public deletarMesaApiMesasAdminMesasMesaIdDelete(
        mesaId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mesas/admin/mesas/{mesa_id}',
            path: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Status Mesa
     * Atualiza apenas o status da mesa
     * @param mesaId
     * @param requestBody
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public atualizarStatusMesaApiMesasAdminMesasMesaIdStatusPatch(
        mesaId: number,
        requestBody: MesaStatusUpdate,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/mesas/admin/mesas/{mesa_id}/status',
            path: {
                'mesa_id': mesaId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Ocupar Mesa
     * Ocupa uma mesa
     * @param mesaId
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public ocuparMesaApiMesasAdminMesasMesaIdOcuparPost(
        mesaId: number,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/mesas/{mesa_id}/ocupar',
            path: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Liberar Mesa
     * Libera uma mesa
     * @param mesaId
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public liberarMesaApiMesasAdminMesasMesaIdLiberarPost(
        mesaId: number,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/mesas/{mesa_id}/liberar',
            path: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reservar Mesa
     * Reserva uma mesa
     * @param mesaId
     * @returns MesaOut Successful Response
     * @throws ApiError
     */
    public reservarMesaApiMesasAdminMesasMesaIdReservarPost(
        mesaId: number,
    ): CancelablePromise<MesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/mesas/{mesa_id}/reservar',
            path: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter Historico Mesa
     * Obtém o histórico completo de operações de uma mesa.
     *
     * - **mesa_id**: ID da mesa (obrigatório, deve ser maior que 0)
     *
     * Retorna todos os registros de operações com timestamps, descrições e observações.
     * @param mesaId ID da mesa
     * @returns HistoricoDaMesaResponse Successful Response
     * @throws ApiError
     */
    public obterHistoricoMesaApiMesasAdminMesasMesaIdHistoricoGet(
        mesaId: number,
    ): CancelablePromise<HistoricoDaMesaResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/mesas/{mesa_id}/historico',
            path: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Pedido
     * @param requestBody
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public criarPedidoApiMesasAdminPedidosPost(
        requestBody: PedidoMesaCreate,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/pedidos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Pedidos Abertos
     * @param mesaId Filtrar por mesa
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public listPedidosAbertosApiMesasAdminPedidosGet(
        mesaId?: (number | null),
    ): CancelablePromise<Array<PedidoMesaOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/pedidos',
            query: {
                'mesa_id': mesaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Adicionar Item
     * @param pedidoId
     * @param requestBody
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public adicionarItemApiMesasAdminPedidosPedidoIdItensPost(
        pedidoId: number,
        requestBody?: AdicionarItemRequest,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/pedidos/{pedido_id}/itens',
            path: {
                'pedido_id': pedidoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remover Item
     * @param pedidoId
     * @param itemId
     * @returns RemoverItemResponse Successful Response
     * @throws ApiError
     */
    public removerItemApiMesasAdminPedidosPedidoIdItensItemIdDelete(
        pedidoId: number,
        itemId: number,
    ): CancelablePromise<RemoverItemResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mesas/admin/pedidos/{pedido_id}/itens/{item_id}',
            path: {
                'pedido_id': pedidoId,
                'item_id': itemId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cancelar Pedido
     * @param pedidoId
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public cancelarPedidoApiMesasAdminPedidosPedidoIdCancelarPost(
        pedidoId: number,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/pedidos/{pedido_id}/cancelar',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Fechar Conta Pedido
     * @param pedidoId
     * @param requestBody
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public fecharContaPedidoApiMesasAdminPedidosPedidoIdFecharContaPost(
        pedidoId: number,
        requestBody?: (FecharContaMesaRequest | null),
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/pedidos/{pedido_id}/fechar-conta',
            path: {
                'pedido_id': pedidoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reabrir Pedido
     * @param pedidoId
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public reabrirPedidoApiMesasAdminPedidosPedidoIdReabrirPost(
        pedidoId: number,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/pedidos/{pedido_id}/reabrir',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirmar Pedido
     * @param pedidoId
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public confirmarPedidoApiMesasAdminPedidosPedidoIdConfirmarPost(
        pedidoId: number,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mesas/admin/pedidos/{pedido_id}/confirmar',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Pedido
     * @param pedidoId
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public getPedidoApiMesasAdminPedidosPedidoIdGet(
        pedidoId: number,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/pedidos/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Observacoes Pedido
     * Atualiza as observações de um pedido
     * @param pedidoId ID do pedido
     * @param requestBody
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public atualizarObservacoesPedidoApiMesasAdminPedidosPedidoIdPut(
        pedidoId: number,
        requestBody: AtualizarObservacoesRequest,
    ): CancelablePromise<PedidoMesaOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mesas/admin/pedidos/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Pedidos Finalizados
     * Retorna todos os pedidos finalizados (ENTREGUE) da mesa especificada, opcionalmente filtrados por data
     * @param mesaId ID da mesa
     * @param data Filtrar por data (YYYY-MM-DD). Se não informado, retorna todos os pedidos finalizados da mesa
     * @returns PedidoMesaOut Successful Response
     * @throws ApiError
     */
    public listPedidosFinalizadosApiMesasAdminPedidosFinalizadosMesaIdGet(
        mesaId: number,
        data?: (string | null),
    ): CancelablePromise<Array<PedidoMesaOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mesas/admin/pedidos/finalizados/{mesa_id}',
            path: {
                'mesa_id': mesaId,
            },
            query: {
                'data': data,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar pedidos abertos
     * Lista todos os pedidos de balcão que estão abertos (não finalizados).
     *
     * **Status considerados abertos:**
     * - PENDENTE
     * - CONFIRMADO
     * - PREPARANDO
     * - PRONTO
     *
     * **Ordenação:** Pedidos mais recentes primeiro.
     * @returns PedidoBalcaoOut Lista de pedidos abertos
     * @throws ApiError
     */
    public listPedidosAbertosApiBalcaoAdminPedidosGet(): CancelablePromise<Array<PedidoBalcaoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/balcao/admin/pedidos',
        });
    }
    /**
     * Criar pedido de balcão
     * Cria um novo pedido de balcão.
     *
     * **Características:**
     * - `mesa_id` é opcional (pode criar pedido sem mesa)
     * - Pode ou não ter `cliente_id` associado
     * - Permite adicionar itens durante a criação
     *
     * **Status inicial:** PENDENTE
     * @param requestBody
     * @returns PedidoBalcaoOut Pedido criado com sucesso
     * @throws ApiError
     */
    public criarPedidoApiBalcaoAdminPedidosPost(
        requestBody: PedidoBalcaoCreate,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/admin/pedidos',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Dados inválidos ou produto não encontrado`,
                404: `Mesa não encontrada (se mesa_id informado)`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Adicionar item ao pedido
     * Adiciona um novo item ao pedido de balcão.
     *
     * **Validações:**
     * - Pedido deve estar aberto (não pode ser CANCELADO ou ENTREGUE)
     * - Produto deve existir e estar disponível
     * - Quantidade deve ser maior que zero
     *
     * **Atualização automática:** O valor total do pedido é recalculado automaticamente.
     * @param pedidoId ID do pedido
     * @param requestBody
     * @returns PedidoBalcaoOut Item adicionado com sucesso
     * @throws ApiError
     */
    public adicionarItemApiBalcaoAdminPedidosPedidoIdItensPost(
        pedidoId: number,
        requestBody: AdicionarItemRequest,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/admin/pedidos/{pedido_id}/itens',
            path: {
                'pedido_id': pedidoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Pedido fechado/cancelado ou dados inválidos`,
                404: `Pedido ou produto não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remover item do pedido
     * Remove um item específico do pedido de balcão.
     *
     * **Validações:**
     * - Pedido deve estar aberto (não pode ser CANCELADO ou ENTREGUE)
     * - Item deve existir no pedido
     *
     * **Atualização automática:** O valor total do pedido é recalculado automaticamente.
     * @param pedidoId ID do pedido
     * @param itemId ID do item a ser removido
     * @returns RemoverItemResponse Item removido com sucesso
     * @throws ApiError
     */
    public removerItemApiBalcaoAdminPedidosPedidoIdItensItemIdDelete(
        pedidoId: number,
        itemId: number,
    ): CancelablePromise<RemoverItemResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/balcao/admin/pedidos/{pedido_id}/itens/{item_id}',
            path: {
                'pedido_id': pedidoId,
                'item_id': itemId,
            },
            errors: {
                400: `Pedido fechado/cancelado`,
                404: `Pedido ou item não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cancelar pedido
     * Cancela um pedido de balcão, alterando seu status para CANCELADO.
     *
     * **Observação:** Pedidos cancelados não podem ser modificados.
     * @param pedidoId ID do pedido a ser cancelado
     * @returns PedidoBalcaoOut Pedido cancelado com sucesso
     * @throws ApiError
     */
    public cancelarPedidoApiBalcaoAdminPedidosPedidoIdCancelarPost(
        pedidoId: number,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/admin/pedidos/{pedido_id}/cancelar',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Fechar conta do pedido
     * Fecha a conta de um pedido de balcão, alterando seu status para ENTREGUE.
     *
     * **Informações de pagamento (opcional):**
     * - `meio_pagamento_id`: ID do meio de pagamento utilizado
     * - `troco_para`: Valor para o qual deseja troco (apenas para pagamento em dinheiro)
     *
     * **Observação:** As informações de pagamento são salvas nas observações do pedido.
     * @param pedidoId ID do pedido
     * @param requestBody
     * @returns PedidoBalcaoOut Conta fechada com sucesso
     * @throws ApiError
     */
    public fecharContaPedidoApiBalcaoAdminPedidosPedidoIdFecharContaPost(
        pedidoId: number,
        requestBody?: (FecharContaBalcaoRequest | null),
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/admin/pedidos/{pedido_id}/fechar-conta',
            path: {
                'pedido_id': pedidoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reabrir pedido
     * Reabre um pedido que foi cancelado ou entregue, alterando seu status para CONFIRMADO.
     *
     * **Validação:** Apenas pedidos com status CANCELADO ou ENTREGUE podem ser reabertos.
     * @param pedidoId ID do pedido a ser reaberto
     * @returns PedidoBalcaoOut Pedido reaberto com sucesso
     * @throws ApiError
     */
    public reabrirPedidoApiBalcaoAdminPedidosPedidoIdReabrirPost(
        pedidoId: number,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/admin/pedidos/{pedido_id}/reabrir',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Confirmar pedido
     * Confirma um pedido de balcão, alterando seu status de PENDENTE para CONFIRMADO.
     *
     * **Fluxo de status:**
     * - PENDENTE → CONFIRMADO → PREPARANDO → PRONTO → ENTREGUE
     *
     * **Observação:** O valor total do pedido é recalculado automaticamente.
     * @param pedidoId ID do pedido a ser confirmado
     * @returns PedidoBalcaoOut Pedido confirmado com sucesso
     * @throws ApiError
     */
    public confirmarPedidoApiBalcaoAdminPedidosPedidoIdConfirmarPost(
        pedidoId: number,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/admin/pedidos/{pedido_id}/confirmar',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Buscar pedido por ID
     * Busca um pedido de balcão específico pelo ID.
     *
     * **Retorna:**
     * - Informações completas do pedido
     * - Lista de itens do pedido
     * - Status atual
     * - Valor total
     * - Dados do cliente (se associado)
     * - Mesa (se associada)
     * @param pedidoId ID do pedido
     * @returns PedidoBalcaoOut Pedido encontrado
     * @throws ApiError
     */
    public getPedidoApiBalcaoAdminPedidosPedidoIdGet(
        pedidoId: number,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/balcao/admin/pedidos/{pedido_id}',
            path: {
                'pedido_id': pedidoId,
            },
            errors: {
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar pedidos finalizados
     * Lista todos os pedidos de balcão que foram finalizados (status ENTREGUE).
     *
     * **Filtros disponíveis:**
     * - `data`: Filtra por data específica (YYYY-MM-DD). Se não informado, retorna todos os pedidos finalizados.
     *
     * **Ordenação:** Pedidos mais recentes primeiro.
     * @param data Filtrar por data (YYYY-MM-DD). Se não informado, retorna todos os pedidos finalizados
     * @returns PedidoBalcaoOut Lista de pedidos finalizados
     * @throws ApiError
     */
    public listPedidosFinalizadosApiBalcaoAdminPedidosFinalizadosGet(
        data?: (string | null),
    ): CancelablePromise<Array<PedidoBalcaoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/balcao/admin/pedidos/finalizados',
            query: {
                'data': data,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter histórico do pedido
     * Obtém o histórico completo de alterações de um pedido de balcão.
     *
     * **Retorna:**
     * - Todas as operações realizadas no pedido
     * - Alterações de status
     * - Adição/remoção de itens
     * - Informações de quem executou cada operação
     * - Timestamps de cada operação
     *
     * **Ordenação:** Operações mais recentes primeiro.
     * @param pedidoId ID do pedido
     * @param limit Limite de registros de histórico
     * @returns HistoricoPedidoBalcaoResponse Histórico retornado com sucesso
     * @throws ApiError
     */
    public obterHistoricoPedidoApiBalcaoAdminPedidosPedidoIdHistoricoGet(
        pedidoId: number,
        limit: number = 100,
    ): CancelablePromise<HistoricoPedidoBalcaoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/balcao/admin/pedidos/{pedido_id}/historico',
            path: {
                'pedido_id': pedidoId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Fechar conta do pedido (Cliente)
     * Permite que um cliente feche a conta de seu próprio pedido de balcão.
     *
     * **Autenticação:** Requer header `X-Super-Token` com o token do cliente.
     *
     * **Validações:**
     * - Cliente deve ser o dono do pedido (se pedido tiver cliente_id associado)
     * - Pedido deve existir
     *
     * **Informações de pagamento:**
     * - `meio_pagamento_id`: ID do meio de pagamento utilizado (opcional)
     * - `troco_para`: Valor para o qual deseja troco, apenas para pagamento em dinheiro (opcional)
     *
     * **Observação:** As informações de pagamento são salvas nas observações do pedido.
     * O status do pedido é alterado para ENTREGUE.
     * @param pedidoId ID do pedido
     * @param xSuperToken
     * @param requestBody
     * @returns PedidoBalcaoOut Conta fechada com sucesso
     * @throws ApiError
     */
    public fecharContaPedidoClienteApiBalcaoClientPedidosPedidoIdFecharContaPost(
        pedidoId: number,
        xSuperToken: string,
        requestBody: FecharContaBalcaoRequest,
    ): CancelablePromise<PedidoBalcaoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/balcao/client/pedidos/{pedido_id}/fechar-conta',
            path: {
                'pedido_id': pedidoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Não autenticado. Requer X-Super-Token`,
                403: `Pedido não pertence ao cliente`,
                404: `Pedido não encontrado`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Parceiros
     * Lista todos os parceiros (endpoint público)
     * @returns ParceiroOut Successful Response
     * @throws ApiError
     */
    public listParceirosApiCadastrosPublicParceirosGet(): CancelablePromise<Array<ParceiroOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/public/parceiros/',
        });
    }
    /**
     * List Banners
     * Lista banners para clientes (endpoint público)
     * @param parceiroId
     * @returns BannerParceiroOut Successful Response
     * @throws ApiError
     */
    public listBannersApiCadastrosPublicParceirosBannersGet(
        parceiroId?: (number | null),
    ): CancelablePromise<Array<BannerParceiroOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/public/parceiros/banners',
            query: {
                'parceiro_id': parceiroId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Parceiro Completo
     * Retorna parceiro completo com banners e cupons (endpoint público)
     * @param parceiroId
     * @returns ParceiroCompletoOut Successful Response
     * @throws ApiError
     */
    public getParceiroCompletoApiCadastrosPublicParceirosParceiroIdFullGet(
        parceiroId: number,
    ): CancelablePromise<ParceiroCompletoOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/public/parceiros/{parceiro_id}/full',
            path: {
                'parceiro_id': parceiroId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
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
    /**
     * Search Categorias
     * @param xSuperToken
     * @param empresaId ID da empresa (obrigatório)
     * @param q Termo de busca por descrição/slug
     * @param limit
     * @param offset
     * @returns CategoriaSearchOut Successful Response
     * @throws ApiError
     */
    public searchCategoriasApiCardapioClientCategoriasSearchGet(
        xSuperToken: string,
        empresaId: number,
        q?: (string | null),
        limit: number = 30,
        offset?: number,
    ): CancelablePromise<Array<CategoriaSearchOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/client/categorias/search',
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
                'empresa_id': empresaId,
                'q': q,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Categoria
     * @param catId
     * @param xSuperToken
     * @param empresaId ID da empresa (obrigatório)
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public getCategoriaApiCardapioClientCategoriasCatIdGet(
        catId: number,
        xSuperToken: string,
        empresaId: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cardapio/client/categorias/{cat_id}',
            path: {
                'cat_id': catId,
            },
            headers: {
                'x-super-token': xSuperToken,
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
     * Novo Dispositivo
     * Endpoint para novo dispositivo.
     * Gera um novo super_token, grava no banco e retorna para o cliente.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public novoDispositivoApiCadastrosClientClientesNovoDispositivoPost(
        requestBody: NovoDispositivoRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/client/clientes/novo-dispositivo',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create New Cliente
     * @param requestBody
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public createNewClienteApiCadastrosClientClientesPost(
        requestBody: ClienteCreate,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/client/clientes/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Current Cliente
     * @param xSuperToken
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public readCurrentClienteApiCadastrosClientClientesMeGet(
        xSuperToken: string,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/client/clientes/me',
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Current Cliente
     * @param xSuperToken
     * @param requestBody
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public updateCurrentClienteApiCadastrosClientClientesMePut(
        xSuperToken: string,
        requestBody: ClienteUpdate,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/client/clientes/me',
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
     * Listar Enderecos
     * @param xSuperToken
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public listarEnderecosApiCadastrosClientEnderecosGet(
        xSuperToken: string,
    ): CancelablePromise<Array<app__api__cardapio__schemas__schema_endereco__EnderecoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/client/enderecos',
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Endereco
     * @param xSuperToken
     * @param requestBody
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public criarEnderecoApiCadastrosClientEnderecosPost(
        xSuperToken: string,
        requestBody: app__api__cardapio__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/client/enderecos',
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
     * Get Endereco
     * @param enderecoId
     * @param xSuperToken
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public getEnderecoApiCadastrosClientEnderecosEnderecoIdGet(
        enderecoId: number,
        xSuperToken: string,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/client/enderecos/{endereco_id}',
            path: {
                'endereco_id': enderecoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Endereco
     * @param enderecoId
     * @param xSuperToken
     * @param requestBody
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public atualizarEnderecoApiCadastrosClientEnderecosEnderecoIdPut(
        enderecoId: number,
        xSuperToken: string,
        requestBody: EnderecoUpdate,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/client/enderecos/{endereco_id}',
            path: {
                'endereco_id': enderecoId,
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
     * Deletar Endereco
     * @param enderecoId
     * @param xSuperToken
     * @returns void
     * @throws ApiError
     */
    public deletarEnderecoApiCadastrosClientEnderecosEnderecoIdDelete(
        enderecoId: number,
        xSuperToken: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/client/enderecos/{endereco_id}',
            path: {
                'endereco_id': enderecoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Endereco Padrao
     * @param enderecoId
     * @param xSuperToken
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public setEnderecoPadraoApiCadastrosClientEnderecosEnderecoIdSetPadraoPost(
        enderecoId: number,
        xSuperToken: string,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/client/enderecos/{endereco_id}/set-padrao',
            path: {
                'endereco_id': enderecoId,
            },
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Meios Pagamento
     * @param xSuperToken
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public listarMeiosPagamentoApiCadastrosClientMeiosPagamentoGet(
        xSuperToken: string,
    ): CancelablePromise<Array<MeioPagamentoResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/client/meios-pagamento/',
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
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
    /**
     * Listar Clientes
     * Endpoint para listar todos os clientes.
     * Requer autenticação de admin.
     * @param ativo Filtrar por status ativo/inativo
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public listarClientesApiCadastrosAdminClientesGet(
        ativo?: (boolean | null),
    ): CancelablePromise<Array<ClienteOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/clientes/',
            query: {
                'ativo': ativo,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Cliente
     * Endpoint para criar um novo cliente.
     * Requer autenticação de admin.
     * @param requestBody
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public criarClienteApiCadastrosAdminClientesPost(
        requestBody: ClienteCreate,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/clientes/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Cliente
     * Endpoint para obter um cliente específico por ID.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public getClienteApiCadastrosAdminClientesClienteIdGet(
        clienteId: number,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/clientes/{cliente_id}',
            path: {
                'cliente_id': clienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Cliente
     * Endpoint para deletar um cliente.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente
     * @returns void
     * @throws ApiError
     */
    public deletarClienteApiCadastrosAdminClientesClienteIdDelete(
        clienteId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/clientes/{cliente_id}',
            path: {
                'cliente_id': clienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Cliente Admin
     * @param clienteId
     * @param requestBody
     * @returns ClienteOut Successful Response
     * @throws ApiError
     */
    public updateClienteAdminApiCadastrosAdminClientesUpdateClienteIdPut(
        clienteId: number,
        requestBody: ClienteAdminUpdate,
    ): CancelablePromise<ClienteOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/clientes/update/{cliente_id}',
            path: {
                'cliente_id': clienteId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Endereco Cliente
     * Endpoint para criar um novo endereço para um cliente específico.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente para adicionar endereço
     * @param requestBody
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public criarEnderecoClienteApiCadastrosAdminClientesClienteIdCriarEnderecoPost(
        clienteId: number,
        requestBody: app__api__cardapio__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/clientes/{cliente_id}/criar-endereco',
            path: {
                'cliente_id': clienteId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Enderecos Cliente
     * Endpoint para consultar endereços de um cliente específico.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente para consultar endereços
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public getEnderecosClienteApiCadastrosAdminClientesClienteIdUpdateEnderecoGet(
        clienteId: number,
    ): CancelablePromise<Array<app__api__cardapio__schemas__schema_endereco__EnderecoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/clientes/{cliente_id}/update-endereco',
            path: {
                'cliente_id': clienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Combos
     * @param codEmpresa
     * @param page
     * @param limit
     * @returns ListaCombosResponse Successful Response
     * @throws ApiError
     */
    public listarCombosApiCadastrosAdminCombosGet(
        codEmpresa: number,
        page: number = 1,
        limit: number = 30,
    ): CancelablePromise<ListaCombosResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/combos/',
            query: {
                'cod_empresa': codEmpresa,
                'page': page,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Combo
     * @param formData
     * @returns ComboDTO Successful Response
     * @throws ApiError
     */
    public criarComboApiCadastrosAdminCombosPost(
        formData: Body_criar_combo_api_cadastros_admin_combos__post,
    ): CancelablePromise<ComboDTO> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/combos/',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter Combo
     * @param comboId
     * @returns ComboDTO Successful Response
     * @throws ApiError
     */
    public obterComboApiCadastrosAdminCombosComboIdGet(
        comboId: number,
    ): CancelablePromise<ComboDTO> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/combos/{combo_id}',
            path: {
                'combo_id': comboId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Combo
     * @param comboId
     * @param formData
     * @returns ComboDTO Successful Response
     * @throws ApiError
     */
    public atualizarComboApiCadastrosAdminCombosComboIdPut(
        comboId: number,
        formData?: Body_atualizar_combo_api_cadastros_admin_combos__combo_id__put,
    ): CancelablePromise<ComboDTO> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/combos/{combo_id}',
            path: {
                'combo_id': comboId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Combo
     * @param comboId
     * @returns void
     * @throws ApiError
     */
    public deletarComboApiCadastrosAdminCombosComboIdDelete(
        comboId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/combos/{combo_id}',
            path: {
                'combo_id': comboId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Enderecos Admin
     * Endpoint para admin listar endereços de um cliente específico.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente para listar endereços
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public listarEnderecosAdminApiCadastrosAdminEnderecosClienteClienteIdGet(
        clienteId: number,
    ): CancelablePromise<Array<app__api__cardapio__schemas__schema_endereco__EnderecoOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/enderecos/cliente/{cliente_id}',
            path: {
                'cliente_id': clienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Criar Endereco Admin
     * Endpoint para admin criar endereço para um cliente específico.
     * Verifica se o endereço já existe antes de criar.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente para criar endereço
     * @param requestBody
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public criarEnderecoAdminApiCadastrosAdminEnderecosClienteClienteIdPost(
        clienteId: number,
        requestBody: app__api__cardapio__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/enderecos/cliente/{cliente_id}',
            path: {
                'cliente_id': clienteId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Endereco Admin
     * Endpoint para admin atualizar endereço de um cliente específico.
     * Verifica se o endereço já existe antes de atualizar.
     * Verifica se o endereço está sendo usado em pedidos ativos.
     * Requer autenticação de admin.
     * @param clienteId ID do cliente
     * @param enderecoId ID do endereço para atualizar
     * @param requestBody
     * @returns app__api__cardapio__schemas__schema_endereco__EnderecoOut Successful Response
     * @throws ApiError
     */
    public atualizarEnderecoAdminApiCadastrosAdminEnderecosClienteClienteIdEnderecoEnderecoIdPut(
        clienteId: number,
        enderecoId: number,
        requestBody: EnderecoUpdate,
    ): CancelablePromise<app__api__cardapio__schemas__schema_endereco__EnderecoOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/enderecos/cliente/{cliente_id}/endereco/{endereco_id}',
            path: {
                'cliente_id': clienteId,
                'endereco_id': enderecoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Listar Entregadores
     * @returns EntregadorOut Successful Response
     * @throws ApiError
     */
    public listarEntregadoresApiCadastrosAdminEntregadoresGet(): CancelablePromise<Array<EntregadorOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/entregadores',
        });
    }
    /**
     * Criar Entregador
     * @param requestBody
     * @returns EntregadorOut Successful Response
     * @throws ApiError
     */
    public criarEntregadorApiCadastrosAdminEntregadoresPost(
        requestBody: EntregadorCreate,
    ): CancelablePromise<EntregadorOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/entregadores',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Entregador
     * @param entregadorId
     * @returns EntregadorOut Successful Response
     * @throws ApiError
     */
    public getEntregadorApiCadastrosAdminEntregadoresEntregadorIdGet(
        entregadorId: number,
    ): CancelablePromise<EntregadorOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/entregadores/{entregador_id}',
            path: {
                'entregador_id': entregadorId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Entregador
     * @param entregadorId
     * @param requestBody
     * @returns EntregadorOut Successful Response
     * @throws ApiError
     */
    public atualizarEntregadorApiCadastrosAdminEntregadoresEntregadorIdPut(
        entregadorId: number,
        requestBody: EntregadorUpdate,
    ): CancelablePromise<EntregadorOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/entregadores/{entregador_id}',
            path: {
                'entregador_id': entregadorId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Entregador
     * @param entregadorId
     * @returns void
     * @throws ApiError
     */
    public deletarEntregadorApiCadastrosAdminEntregadoresEntregadorIdDelete(
        entregadorId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/entregadores/{entregador_id}',
            path: {
                'entregador_id': entregadorId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Vincular Entregador Empresa
     * @param entregadorId
     * @param empresaId ID da empresa a ser vinculada
     * @returns EntregadorOut Successful Response
     * @throws ApiError
     */
    public vincularEntregadorEmpresaApiCadastrosAdminEntregadoresEntregadorIdVincularEmpresaPost(
        entregadorId: number,
        empresaId: number,
    ): CancelablePromise<EntregadorOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/entregadores/{entregador_id}/vincular_empresa',
            path: {
                'entregador_id': entregadorId,
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
     * Desvincular Entregador Empresa
     * @param entregadorId
     * @param empresaId ID da empresa a ser desvinculada
     * @returns EntregadorOut Successful Response
     * @throws ApiError
     */
    public desvincularEntregadorEmpresaApiCadastrosAdminEntregadoresEntregadorIdVincularEmpresaDelete(
        entregadorId: number,
        empresaId: number,
    ): CancelablePromise<EntregadorOut> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/entregadores/{entregador_id}/vincular_empresa',
            path: {
                'entregador_id': entregadorId,
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
     * Listar Meios Pagamento Admin
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public listarMeiosPagamentoAdminApiCadastrosAdminMeiosPagamentoGet(): CancelablePromise<Array<MeioPagamentoResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/meios-pagamento/',
        });
    }
    /**
     * Criar Meio Pagamento
     * @param requestBody
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public criarMeioPagamentoApiCadastrosAdminMeiosPagamentoPost(
        requestBody: MeioPagamentoCreate,
    ): CancelablePromise<MeioPagamentoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/meios-pagamento/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Obter Meio Pagamento
     * @param meioPagamentoId
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public obterMeioPagamentoApiCadastrosAdminMeiosPagamentoMeioPagamentoIdGet(
        meioPagamentoId: number,
    ): CancelablePromise<MeioPagamentoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/meios-pagamento/{meio_pagamento_id}',
            path: {
                'meio_pagamento_id': meioPagamentoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Atualizar Meio Pagamento
     * @param meioPagamentoId
     * @param requestBody
     * @returns MeioPagamentoResponse Successful Response
     * @throws ApiError
     */
    public atualizarMeioPagamentoApiCadastrosAdminMeiosPagamentoMeioPagamentoIdPut(
        meioPagamentoId: number,
        requestBody: MeioPagamentoUpdate,
    ): CancelablePromise<MeioPagamentoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/meios-pagamento/{meio_pagamento_id}',
            path: {
                'meio_pagamento_id': meioPagamentoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Deletar Meio Pagamento
     * @param meioPagamentoId
     * @returns any Successful Response
     * @throws ApiError
     */
    public deletarMeioPagamentoApiCadastrosAdminMeiosPagamentoMeioPagamentoIdDelete(
        meioPagamentoId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/meios-pagamento/{meio_pagamento_id}',
            path: {
                'meio_pagamento_id': meioPagamentoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Parceiros
     * Lista parceiros cadastrados (endpoint admin)
     * @returns ParceiroOut Successful Response
     * @throws ApiError
     */
    public listParceirosApiCadastrosAdminParceirosGet(): CancelablePromise<Array<ParceiroOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/parceiros/',
        });
    }
    /**
     * Create Parceiro
     * Cria um novo parceiro (endpoint admin)
     * @param requestBody
     * @returns ParceiroOut Successful Response
     * @throws ApiError
     */
    public createParceiroApiCadastrosAdminParceirosPost(
        requestBody: ParceiroIn,
    ): CancelablePromise<ParceiroOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/parceiros/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Parceiro
     * Retorna dados de um parceiro específico (endpoint admin)
     * @param parceiroId
     * @returns ParceiroOut Successful Response
     * @throws ApiError
     */
    public getParceiroApiCadastrosAdminParceirosParceiroIdGet(
        parceiroId: number,
    ): CancelablePromise<ParceiroOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/parceiros/{parceiro_id}',
            path: {
                'parceiro_id': parceiroId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Parceiro
     * Atualiza um parceiro existente (endpoint admin)
     * @param parceiroId
     * @param requestBody
     * @returns ParceiroOut Successful Response
     * @throws ApiError
     */
    public updateParceiroApiCadastrosAdminParceirosParceiroIdPut(
        parceiroId: number,
        requestBody: ParceiroIn,
    ): CancelablePromise<ParceiroOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/parceiros/{parceiro_id}',
            path: {
                'parceiro_id': parceiroId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Parceiro
     * Deleta um parceiro (endpoint admin)
     * @param parceiroId
     * @returns void
     * @throws ApiError
     */
    public deleteParceiroApiCadastrosAdminParceirosParceiroIdDelete(
        parceiroId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/parceiros/{parceiro_id}',
            path: {
                'parceiro_id': parceiroId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Banner
     * Cria um novo banner para parceiro (endpoint admin)
     * @param formData
     * @returns BannerParceiroOut Successful Response
     * @throws ApiError
     */
    public createBannerApiCadastrosAdminParceirosBannersPost(
        formData: Body_create_banner_api_cadastros_admin_parceiros_banners_post,
    ): CancelablePromise<BannerParceiroOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/parceiros/banners',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Banner
     * Atualiza um banner existente (endpoint admin)
     * @param bannerId
     * @param requestBody
     * @returns BannerParceiroOut Successful Response
     * @throws ApiError
     */
    public updateBannerApiCadastrosAdminParceirosBannersBannerIdPut(
        bannerId: number,
        requestBody: BannerParceiroIn,
    ): CancelablePromise<BannerParceiroOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/parceiros/banners/{banner_id}',
            path: {
                'banner_id': bannerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Banner
     * Deleta um banner (endpoint admin)
     * @param bannerId
     * @returns void
     * @throws ApiError
     */
    public deleteBannerApiCadastrosAdminParceirosBannersBannerIdDelete(
        bannerId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/parceiros/banners/{banner_id}',
            path: {
                'banner_id': bannerId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
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
    /**
     * List Regioes
     * @param empresaId
     * @returns RegiaoEntregaOut Successful Response
     * @throws ApiError
     */
    public listRegioesApiCadastrosAdminRegioesEntregaEmpresaIdGet(
        empresaId: number,
    ): CancelablePromise<Array<RegiaoEntregaOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/regioes-entrega/{empresa_id}',
            path: {
                'empresa_id': empresaId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Regiao
     * @param regiaoId
     * @returns RegiaoEntregaOut Successful Response
     * @throws ApiError
     */
    public getRegiaoApiCadastrosAdminRegioesEntregaDetalhesRegiaoIdGet(
        regiaoId: number,
    ): CancelablePromise<RegiaoEntregaOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/regioes-entrega/detalhes/{regiao_id}',
            path: {
                'regiao_id': regiaoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Regiao
     * @param requestBody
     * @returns RegiaoEntregaOut Successful Response
     * @throws ApiError
     */
    public createRegiaoApiCadastrosAdminRegioesEntregaPost(
        requestBody: RegiaoEntregaCreate,
    ): CancelablePromise<RegiaoEntregaOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/regioes-entrega/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Regiao
     * @param regiaoId
     * @param requestBody
     * @returns RegiaoEntregaOut Successful Response
     * @throws ApiError
     */
    public updateRegiaoApiCadastrosAdminRegioesEntregaRegiaoIdPut(
        regiaoId: number,
        requestBody: RegiaoEntregaUpdate,
    ): CancelablePromise<RegiaoEntregaOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/regioes-entrega/{regiao_id}',
            path: {
                'regiao_id': regiaoId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Regiao
     * @param regiaoId
     * @returns any Successful Response
     * @throws ApiError
     */
    public deleteRegiaoApiCadastrosAdminRegioesEntregaRegiaoIdDelete(
        regiaoId: number,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/regioes-entrega/{regiao_id}',
            path: {
                'regiao_id': regiaoId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Login Usuario
     * @param requestBody
     * @returns TokenResponse Successful Response
     * @throws ApiError
     */
    public loginUsuarioApiAuthTokenPost(
        requestBody: LoginRequest,
    ): CancelablePromise<TokenResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Retorna o usuário atual baseado no token JWT
     * Puxa o usuário já autenticado pelo get_current_user e devolve seus campos.
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public obterUsuarioAtualApiAuthMeGet(): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/auth/me',
        });
    }
    /**
     * Retorna o Cliente atual baseado no x-super-token
     * Puxa o Cliente já autenticado pelo get_cliente_by_super_token (header X-Super-Token) e retorna apenas nome, token e telefone.
     * @param xSuperToken
     * @returns ClienteMeResponse Successful Response
     * @throws ApiError
     */
    public obterClienteAtualApiAuthClientMeGet(
        xSuperToken: string,
    ): CancelablePromise<ClienteMeResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/auth/client/me',
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
