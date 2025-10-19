/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AdminDeliveryCategoriasService } from './services/AdminDeliveryCategoriasService';
import { AdminDeliveryClientesService } from './services/AdminDeliveryClientesService';
import { AdminDeliveryCuponsService } from './services/AdminDeliveryCuponsService';
import { AdminDeliveryEndereOsService } from './services/AdminDeliveryEndereOsService';
import { AdminDeliveryEntregadoresService } from './services/AdminDeliveryEntregadoresService';
import { AdminDeliveryMeiosDePagamentoService } from './services/AdminDeliveryMeiosDePagamentoService';
import { AdminDeliveryPagamentosService } from './services/AdminDeliveryPagamentosService';
import { AdminDeliveryParceirosService } from './services/AdminDeliveryParceirosService';
import { AdminDeliveryPedidosService } from './services/AdminDeliveryPedidosService';
import { AdminDeliveryRegiEsDeEntregaService } from './services/AdminDeliveryRegiEsDeEntregaService';
import { AdminDeliveryVitrinesService } from './services/AdminDeliveryVitrinesService';
import { AdminMensuraCategoriasService } from './services/AdminMensuraCategoriasService';
import { AdminMensuraEmpresasService } from './services/AdminMensuraEmpresasService';
import { AdminMensuraEnderecosService } from './services/AdminMensuraEnderecosService';
import { AdminMensuraGeoapifyService } from './services/AdminMensuraGeoapifyService';
import { AdminMensuraProdutosService } from './services/AdminMensuraProdutosService';
import { AdminMensuraUsuariosService } from './services/AdminMensuraUsuariosService';
import { AdminMinIoService } from './services/AdminMinIoService';
import { AuthService } from './services/AuthService';
import { ClientDeliveryCategoriasService } from './services/ClientDeliveryCategoriasService';
import { ClientDeliveryClientesService } from './services/ClientDeliveryClientesService';
import { ClientDeliveryMeiosDePagamentoService } from './services/ClientDeliveryMeiosDePagamentoService';
import { ClientDeliveryPagamentosService } from './services/ClientDeliveryPagamentosService';
import { ClientDeliveryPedidosService } from './services/ClientDeliveryPedidosService';
import { ClientEnderecosDeliveryService } from './services/ClientEnderecosDeliveryService';
import { ClientMensuraGeoapifyService } from './services/ClientMensuraGeoapifyService';
import { PublicDeliveryHomeService } from './services/PublicDeliveryHomeService';
import { PublicDeliveryMercadoPagoWebhooksService } from './services/PublicDeliveryMercadoPagoWebhooksService';
import { PublicDeliveryParceirosService } from './services/PublicDeliveryParceirosService';
import { PublicDeliveryPrinterService } from './services/PublicDeliveryPrinterService';
import { PublicMensuraEmpresasService } from './services/PublicMensuraEmpresasService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class MensuraApiClient {
    public readonly adminDeliveryCategorias: AdminDeliveryCategoriasService;
    public readonly adminDeliveryClientes: AdminDeliveryClientesService;
    public readonly adminDeliveryCupons: AdminDeliveryCuponsService;
    public readonly adminDeliveryEndereOs: AdminDeliveryEndereOsService;
    public readonly adminDeliveryEntregadores: AdminDeliveryEntregadoresService;
    public readonly adminDeliveryMeiosDePagamento: AdminDeliveryMeiosDePagamentoService;
    public readonly adminDeliveryPagamentos: AdminDeliveryPagamentosService;
    public readonly adminDeliveryParceiros: AdminDeliveryParceirosService;
    public readonly adminDeliveryPedidos: AdminDeliveryPedidosService;
    public readonly adminDeliveryRegiEsDeEntrega: AdminDeliveryRegiEsDeEntregaService;
    public readonly adminDeliveryVitrines: AdminDeliveryVitrinesService;
    public readonly adminMensuraCategorias: AdminMensuraCategoriasService;
    public readonly adminMensuraEmpresas: AdminMensuraEmpresasService;
    public readonly adminMensuraEnderecos: AdminMensuraEnderecosService;
    public readonly adminMensuraGeoapify: AdminMensuraGeoapifyService;
    public readonly adminMensuraProdutos: AdminMensuraProdutosService;
    public readonly adminMensuraUsuarios: AdminMensuraUsuariosService;
    public readonly adminMinIo: AdminMinIoService;
    public readonly auth: AuthService;
    public readonly clientDeliveryCategorias: ClientDeliveryCategoriasService;
    public readonly clientDeliveryClientes: ClientDeliveryClientesService;
    public readonly clientDeliveryMeiosDePagamento: ClientDeliveryMeiosDePagamentoService;
    public readonly clientDeliveryPagamentos: ClientDeliveryPagamentosService;
    public readonly clientDeliveryPedidos: ClientDeliveryPedidosService;
    public readonly clientEnderecosDelivery: ClientEnderecosDeliveryService;
    public readonly clientMensuraGeoapify: ClientMensuraGeoapifyService;
    public readonly publicDeliveryHome: PublicDeliveryHomeService;
    public readonly publicDeliveryMercadoPagoWebhooks: PublicDeliveryMercadoPagoWebhooksService;
    public readonly publicDeliveryParceiros: PublicDeliveryParceirosService;
    public readonly publicDeliveryPrinter: PublicDeliveryPrinterService;
    public readonly publicMensuraEmpresas: PublicMensuraEmpresasService;
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
        this.adminDeliveryCategorias = new AdminDeliveryCategoriasService(this.request);
        this.adminDeliveryClientes = new AdminDeliveryClientesService(this.request);
        this.adminDeliveryCupons = new AdminDeliveryCuponsService(this.request);
        this.adminDeliveryEndereOs = new AdminDeliveryEndereOsService(this.request);
        this.adminDeliveryEntregadores = new AdminDeliveryEntregadoresService(this.request);
        this.adminDeliveryMeiosDePagamento = new AdminDeliveryMeiosDePagamentoService(this.request);
        this.adminDeliveryPagamentos = new AdminDeliveryPagamentosService(this.request);
        this.adminDeliveryParceiros = new AdminDeliveryParceirosService(this.request);
        this.adminDeliveryPedidos = new AdminDeliveryPedidosService(this.request);
        this.adminDeliveryRegiEsDeEntrega = new AdminDeliveryRegiEsDeEntregaService(this.request);
        this.adminDeliveryVitrines = new AdminDeliveryVitrinesService(this.request);
        this.adminMensuraCategorias = new AdminMensuraCategoriasService(this.request);
        this.adminMensuraEmpresas = new AdminMensuraEmpresasService(this.request);
        this.adminMensuraEnderecos = new AdminMensuraEnderecosService(this.request);
        this.adminMensuraGeoapify = new AdminMensuraGeoapifyService(this.request);
        this.adminMensuraProdutos = new AdminMensuraProdutosService(this.request);
        this.adminMensuraUsuarios = new AdminMensuraUsuariosService(this.request);
        this.adminMinIo = new AdminMinIoService(this.request);
        this.auth = new AuthService(this.request);
        this.clientDeliveryCategorias = new ClientDeliveryCategoriasService(this.request);
        this.clientDeliveryClientes = new ClientDeliveryClientesService(this.request);
        this.clientDeliveryMeiosDePagamento = new ClientDeliveryMeiosDePagamentoService(this.request);
        this.clientDeliveryPagamentos = new ClientDeliveryPagamentosService(this.request);
        this.clientDeliveryPedidos = new ClientDeliveryPedidosService(this.request);
        this.clientEnderecosDelivery = new ClientEnderecosDeliveryService(this.request);
        this.clientMensuraGeoapify = new ClientMensuraGeoapifyService(this.request);
        this.publicDeliveryHome = new PublicDeliveryHomeService(this.request);
        this.publicDeliveryMercadoPagoWebhooks = new PublicDeliveryMercadoPagoWebhooksService(this.request);
        this.publicDeliveryParceiros = new PublicDeliveryParceirosService(this.request);
        this.publicDeliveryPrinter = new PublicDeliveryPrinterService(this.request);
        this.publicMensuraEmpresas = new PublicMensuraEmpresasService(this.request);
    }
}

