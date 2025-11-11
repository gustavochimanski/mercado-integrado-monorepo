/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OpenAPIConfig } from './core/OpenAPI';
import { BaseHttpRequest } from './core/BaseHttpRequest';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AdminBalcOPedidosService } from './services/AdminBalcOPedidosService';
import { AdminCadastrosAdicionaisService } from './services/AdminCadastrosAdicionaisService';
import { AdminCadastrosCategoriasService } from './services/AdminCadastrosCategoriasService';
import { AdminCadastrosClientesService } from './services/AdminCadastrosClientesService';
import { AdminCadastrosCombosService } from './services/AdminCadastrosCombosService';
import { AdminCadastrosEmpresasService } from './services/AdminCadastrosEmpresasService';
import { AdminCadastrosEndereOsService } from './services/AdminCadastrosEndereOsService';
import { AdminCadastrosEntregadoresService } from './services/AdminCadastrosEntregadoresService';
import { AdminCadastrosMeiosDePagamentoService } from './services/AdminCadastrosMeiosDePagamentoService';
import { AdminCadastrosParceirosService } from './services/AdminCadastrosParceirosService';
import { AdminCadastrosProdutosService } from './services/AdminCadastrosProdutosService';
import { AdminCadastrosRegiEsDeEntregaService } from './services/AdminCadastrosRegiEsDeEntregaService';
import { AdminCaixasService } from './services/AdminCaixasService';
import { AdminCardapioCategoriasService } from './services/AdminCardapioCategoriasService';
import { AdminCardPioMinIoService } from './services/AdminCardPioMinIoService';
import { AdminCardPioPagamentosService } from './services/AdminCardPioPagamentosService';
import { AdminCardPioPedidosService } from './services/AdminCardPioPedidosService';
import { AdminCardPioVitrinesService } from './services/AdminCardPioVitrinesService';
import { AdminDeliveryCuponsService } from './services/AdminDeliveryCuponsService';
import { AdminFinanceiroAcertosDeEntregadoresService } from './services/AdminFinanceiroAcertosDeEntregadoresService';
import { AdminGeoapifyService } from './services/AdminGeoapifyService';
import { AdminMensuraEnderecosService } from './services/AdminMensuraEnderecosService';
import { AdminMensuraReceitasService } from './services/AdminMensuraReceitasService';
import { AdminMensuraUsuariosService } from './services/AdminMensuraUsuariosService';
import { AdminMesasService } from './services/AdminMesasService';
import { AdminMesasPedidosService } from './services/AdminMesasPedidosService';
import { AdminRelatRiosPanorMicoDiRioService } from './services/AdminRelatRiosPanorMicoDiRioService';
import { AdminRotasDeAdministraOService } from './services/AdminRotasDeAdministraOService';
import { ApiBalcOService } from './services/ApiBalcOService';
import { ApiCadastrosService } from './services/ApiCadastrosService';
import { ApiCaixaService } from './services/ApiCaixaService';
import { ApiMesasService } from './services/ApiMesasService';
import { ApiNotificationsService } from './services/ApiNotificationsService';
import { ApiRelatRiosService } from './services/ApiRelatRiosService';
import { AuthService } from './services/AuthService';
import { ClientBalcOPedidosService } from './services/ClientBalcOPedidosService';
import { ClientCadastrosAdicionaisService } from './services/ClientCadastrosAdicionaisService';
import { ClientCadastrosClientesService } from './services/ClientCadastrosClientesService';
import { ClientCadastrosEndereOsService } from './services/ClientCadastrosEndereOsService';
import { ClientCadastrosMeiosDePagamentoService } from './services/ClientCadastrosMeiosDePagamentoService';
import { ClientCardPioCategoriasService } from './services/ClientCardPioCategoriasService';
import { ClientCardPioPagamentosService } from './services/ClientCardPioPagamentosService';
import { ClientCardPioPedidosService } from './services/ClientCardPioPedidosService';
import { ClientGeoapifyService } from './services/ClientGeoapifyService';
import { ClientRotasDeClienteService } from './services/ClientRotasDeClienteService';
import { DefaultService } from './services/DefaultService';
import { EventsService } from './services/EventsService';
import { GatewayOrquestradorService } from './services/GatewayOrquestradorService';
import { HistoricoService } from './services/HistoricoService';
import { MonitoringMonitoramentoService } from './services/MonitoringMonitoramentoService';
import { NotificationsService } from './services/NotificationsService';
import { PedidoNotificationsService } from './services/PedidoNotificationsService';
import { PublicCadastrosEmpresasService } from './services/PublicCadastrosEmpresasService';
import { PublicCadastrosParceirosService } from './services/PublicCadastrosParceirosService';
import { PublicCardPioPrinterService } from './services/PublicCardPioPrinterService';
import { PublicDeliveryHomeService } from './services/PublicDeliveryHomeService';
import { PublicDeliveryMercadoPagoWebhooksService } from './services/PublicDeliveryMercadoPagoWebhooksService';
import { PublicRotasPBlicasService } from './services/PublicRotasPBlicasService';
import { RabbitmqService } from './services/RabbitmqService';
import { SubscriptionsService } from './services/SubscriptionsService';
import { WebsocketService } from './services/WebsocketService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class MensuraApiClient {
    public readonly adminBalcOPedidos: AdminBalcOPedidosService;
    public readonly adminCadastrosAdicionais: AdminCadastrosAdicionaisService;
    public readonly adminCadastrosCategorias: AdminCadastrosCategoriasService;
    public readonly adminCadastrosClientes: AdminCadastrosClientesService;
    public readonly adminCadastrosCombos: AdminCadastrosCombosService;
    public readonly adminCadastrosEmpresas: AdminCadastrosEmpresasService;
    public readonly adminCadastrosEndereOs: AdminCadastrosEndereOsService;
    public readonly adminCadastrosEntregadores: AdminCadastrosEntregadoresService;
    public readonly adminCadastrosMeiosDePagamento: AdminCadastrosMeiosDePagamentoService;
    public readonly adminCadastrosParceiros: AdminCadastrosParceirosService;
    public readonly adminCadastrosProdutos: AdminCadastrosProdutosService;
    public readonly adminCadastrosRegiEsDeEntrega: AdminCadastrosRegiEsDeEntregaService;
    public readonly adminCaixas: AdminCaixasService;
    public readonly adminCardapioCategorias: AdminCardapioCategoriasService;
    public readonly adminCardPioMinIo: AdminCardPioMinIoService;
    public readonly adminCardPioPagamentos: AdminCardPioPagamentosService;
    public readonly adminCardPioPedidos: AdminCardPioPedidosService;
    public readonly adminCardPioVitrines: AdminCardPioVitrinesService;
    public readonly adminDeliveryCupons: AdminDeliveryCuponsService;
    public readonly adminFinanceiroAcertosDeEntregadores: AdminFinanceiroAcertosDeEntregadoresService;
    public readonly adminGeoapify: AdminGeoapifyService;
    public readonly adminMensuraEnderecos: AdminMensuraEnderecosService;
    public readonly adminMensuraReceitas: AdminMensuraReceitasService;
    public readonly adminMensuraUsuarios: AdminMensuraUsuariosService;
    public readonly adminMesas: AdminMesasService;
    public readonly adminMesasPedidos: AdminMesasPedidosService;
    public readonly adminRelatRiosPanorMicoDiRio: AdminRelatRiosPanorMicoDiRioService;
    public readonly adminRotasDeAdministraO: AdminRotasDeAdministraOService;
    public readonly apiBalcO: ApiBalcOService;
    public readonly apiCadastros: ApiCadastrosService;
    public readonly apiCaixa: ApiCaixaService;
    public readonly apiMesas: ApiMesasService;
    public readonly apiNotifications: ApiNotificationsService;
    public readonly apiRelatRios: ApiRelatRiosService;
    public readonly auth: AuthService;
    public readonly clientBalcOPedidos: ClientBalcOPedidosService;
    public readonly clientCadastrosAdicionais: ClientCadastrosAdicionaisService;
    public readonly clientCadastrosClientes: ClientCadastrosClientesService;
    public readonly clientCadastrosEndereOs: ClientCadastrosEndereOsService;
    public readonly clientCadastrosMeiosDePagamento: ClientCadastrosMeiosDePagamentoService;
    public readonly clientCardPioCategorias: ClientCardPioCategoriasService;
    public readonly clientCardPioPagamentos: ClientCardPioPagamentosService;
    public readonly clientCardPioPedidos: ClientCardPioPedidosService;
    public readonly clientGeoapify: ClientGeoapifyService;
    public readonly clientRotasDeCliente: ClientRotasDeClienteService;
    public readonly default: DefaultService;
    public readonly events: EventsService;
    public readonly gatewayOrquestrador: GatewayOrquestradorService;
    public readonly historico: HistoricoService;
    public readonly monitoringMonitoramento: MonitoringMonitoramentoService;
    public readonly notifications: NotificationsService;
    public readonly pedidoNotifications: PedidoNotificationsService;
    public readonly publicCadastrosEmpresas: PublicCadastrosEmpresasService;
    public readonly publicCadastrosParceiros: PublicCadastrosParceirosService;
    public readonly publicCardPioPrinter: PublicCardPioPrinterService;
    public readonly publicDeliveryHome: PublicDeliveryHomeService;
    public readonly publicDeliveryMercadoPagoWebhooks: PublicDeliveryMercadoPagoWebhooksService;
    public readonly publicRotasPBlicas: PublicRotasPBlicasService;
    public readonly rabbitmq: RabbitmqService;
    public readonly subscriptions: SubscriptionsService;
    public readonly websocket: WebsocketService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'https://teste2.mensuraapi.com.br',
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.adminBalcOPedidos = new AdminBalcOPedidosService(this.request);
        this.adminCadastrosAdicionais = new AdminCadastrosAdicionaisService(this.request);
        this.adminCadastrosCategorias = new AdminCadastrosCategoriasService(this.request);
        this.adminCadastrosClientes = new AdminCadastrosClientesService(this.request);
        this.adminCadastrosCombos = new AdminCadastrosCombosService(this.request);
        this.adminCadastrosEmpresas = new AdminCadastrosEmpresasService(this.request);
        this.adminCadastrosEndereOs = new AdminCadastrosEndereOsService(this.request);
        this.adminCadastrosEntregadores = new AdminCadastrosEntregadoresService(this.request);
        this.adminCadastrosMeiosDePagamento = new AdminCadastrosMeiosDePagamentoService(this.request);
        this.adminCadastrosParceiros = new AdminCadastrosParceirosService(this.request);
        this.adminCadastrosProdutos = new AdminCadastrosProdutosService(this.request);
        this.adminCadastrosRegiEsDeEntrega = new AdminCadastrosRegiEsDeEntregaService(this.request);
        this.adminCaixas = new AdminCaixasService(this.request);
        this.adminCardapioCategorias = new AdminCardapioCategoriasService(this.request);
        this.adminCardPioMinIo = new AdminCardPioMinIoService(this.request);
        this.adminCardPioPagamentos = new AdminCardPioPagamentosService(this.request);
        this.adminCardPioPedidos = new AdminCardPioPedidosService(this.request);
        this.adminCardPioVitrines = new AdminCardPioVitrinesService(this.request);
        this.adminDeliveryCupons = new AdminDeliveryCuponsService(this.request);
        this.adminFinanceiroAcertosDeEntregadores = new AdminFinanceiroAcertosDeEntregadoresService(this.request);
        this.adminGeoapify = new AdminGeoapifyService(this.request);
        this.adminMensuraEnderecos = new AdminMensuraEnderecosService(this.request);
        this.adminMensuraReceitas = new AdminMensuraReceitasService(this.request);
        this.adminMensuraUsuarios = new AdminMensuraUsuariosService(this.request);
        this.adminMesas = new AdminMesasService(this.request);
        this.adminMesasPedidos = new AdminMesasPedidosService(this.request);
        this.adminRelatRiosPanorMicoDiRio = new AdminRelatRiosPanorMicoDiRioService(this.request);
        this.adminRotasDeAdministraO = new AdminRotasDeAdministraOService(this.request);
        this.apiBalcO = new ApiBalcOService(this.request);
        this.apiCadastros = new ApiCadastrosService(this.request);
        this.apiCaixa = new ApiCaixaService(this.request);
        this.apiMesas = new ApiMesasService(this.request);
        this.apiNotifications = new ApiNotificationsService(this.request);
        this.apiRelatRios = new ApiRelatRiosService(this.request);
        this.auth = new AuthService(this.request);
        this.clientBalcOPedidos = new ClientBalcOPedidosService(this.request);
        this.clientCadastrosAdicionais = new ClientCadastrosAdicionaisService(this.request);
        this.clientCadastrosClientes = new ClientCadastrosClientesService(this.request);
        this.clientCadastrosEndereOs = new ClientCadastrosEndereOsService(this.request);
        this.clientCadastrosMeiosDePagamento = new ClientCadastrosMeiosDePagamentoService(this.request);
        this.clientCardPioCategorias = new ClientCardPioCategoriasService(this.request);
        this.clientCardPioPagamentos = new ClientCardPioPagamentosService(this.request);
        this.clientCardPioPedidos = new ClientCardPioPedidosService(this.request);
        this.clientGeoapify = new ClientGeoapifyService(this.request);
        this.clientRotasDeCliente = new ClientRotasDeClienteService(this.request);
        this.default = new DefaultService(this.request);
        this.events = new EventsService(this.request);
        this.gatewayOrquestrador = new GatewayOrquestradorService(this.request);
        this.historico = new HistoricoService(this.request);
        this.monitoringMonitoramento = new MonitoringMonitoramentoService(this.request);
        this.notifications = new NotificationsService(this.request);
        this.pedidoNotifications = new PedidoNotificationsService(this.request);
        this.publicCadastrosEmpresas = new PublicCadastrosEmpresasService(this.request);
        this.publicCadastrosParceiros = new PublicCadastrosParceirosService(this.request);
        this.publicCardPioPrinter = new PublicCardPioPrinterService(this.request);
        this.publicDeliveryHome = new PublicDeliveryHomeService(this.request);
        this.publicDeliveryMercadoPagoWebhooks = new PublicDeliveryMercadoPagoWebhooksService(this.request);
        this.publicRotasPBlicas = new PublicRotasPBlicasService(this.request);
        this.rabbitmq = new RabbitmqService(this.request);
        this.subscriptions = new SubscriptionsService(this.request);
        this.websocket = new WebsocketService(this.request);
    }
}


