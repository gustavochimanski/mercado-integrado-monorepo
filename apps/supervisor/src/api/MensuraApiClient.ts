/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AuthService } from './services/AuthService';
import { BiService } from './services/BiService';
import { CardPioService } from './services/CardPioService';
import { ClienteService } from './services/ClienteService';
import { ComprasService } from './services/ComprasService';
import { DashboardService } from './services/DashboardService';
import { DeliveryCategoriasService } from './services/DeliveryCategoriasService';
import { DeliveryCuponsService } from './services/DeliveryCuponsService';
import { DeliveryEndereOsService } from './services/DeliveryEndereOsService';
import { DeliveryEntregadoresService } from './services/DeliveryEntregadoresService';
import { DeliveryVitrinesService } from './services/DeliveryVitrinesService';
import { EmpresasService } from './services/EmpresasService';
import { EnderecosService } from './services/EnderecosService';
import { MetasService } from './services/MetasService';
import { PedidosService } from './services/PedidosService';
import { ProdutosDeliveryService } from './services/ProdutosDeliveryService';
import { PublicService } from './services/PublicService';
import { UsuariosService } from './services/UsuariosService';
import { VendasService } from './services/VendasService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class MensuraApiClient {
    public readonly auth: AuthService;
    public readonly bi: BiService;
    public readonly cardPio: CardPioService;
    public readonly cliente: ClienteService;
    public readonly compras: ComprasService;
    public readonly dashboard: DashboardService;
    public readonly deliveryCategorias: DeliveryCategoriasService;
    public readonly deliveryCupons: DeliveryCuponsService;
    public readonly deliveryEndereOs: DeliveryEndereOsService;
    public readonly deliveryEntregadores: DeliveryEntregadoresService;
    public readonly deliveryVitrines: DeliveryVitrinesService;
    public readonly empresas: EmpresasService;
    public readonly enderecos: EnderecosService;
    public readonly metas: MetasService;
    public readonly pedidos: PedidosService;
    public readonly produtosDelivery: ProdutosDeliveryService;
    public readonly public: PublicService;
    public readonly usuarios: UsuariosService;
    public readonly vendas: VendasService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.auth = new AuthService(this.request);
        this.bi = new BiService(this.request);
        this.cardPio = new CardPioService(this.request);
        this.cliente = new ClienteService(this.request);
        this.compras = new ComprasService(this.request);
        this.dashboard = new DashboardService(this.request);
        this.deliveryCategorias = new DeliveryCategoriasService(this.request);
        this.deliveryCupons = new DeliveryCuponsService(this.request);
        this.deliveryEndereOs = new DeliveryEndereOsService(this.request);
        this.deliveryEntregadores = new DeliveryEntregadoresService(this.request);
        this.deliveryVitrines = new DeliveryVitrinesService(this.request);
        this.empresas = new EmpresasService(this.request);
        this.enderecos = new EnderecosService(this.request);
        this.metas = new MetasService(this.request);
        this.pedidos = new PedidosService(this.request);
        this.produtosDelivery = new ProdutosDeliveryService(this.request);
        this.public = new PublicService(this.request);
        this.usuarios = new UsuariosService(this.request);
        this.vendas = new VendasService(this.request);
    }
}

