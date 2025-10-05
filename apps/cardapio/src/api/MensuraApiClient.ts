/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AuthService } from './services/AuthService';
import { BiService } from './services/BiService';
import { CategoriasAdminDeliveryService } from './services/CategoriasAdminDeliveryService';
import { CategoriasClienteDeliveryService } from './services/CategoriasClienteDeliveryService';
import { ClienteAdminDeliveryService } from './services/ClienteAdminDeliveryService';
import { ClienteClienteDeliveryService } from './services/ClienteClienteDeliveryService';
import { ComprasService } from './services/ComprasService';
import { CuponsAdminDeliveryService } from './services/CuponsAdminDeliveryService';
import { DashboardService } from './services/DashboardService';
import { EmpresasService } from './services/EmpresasService';
import { EmpresasClientService } from './services/EmpresasClientService';
import { EnderecosService } from './services/EnderecosService';
import { EndereOsAdminDeliveryService } from './services/EndereOsAdminDeliveryService';
import { EndereOsClienteDeliveryService } from './services/EndereOsClienteDeliveryService';
import { EntregadoresAdminDeliveryService } from './services/EntregadoresAdminDeliveryService';
import { GeoapifyService } from './services/GeoapifyService';
import { HomePBlicoDeliveryService } from './services/HomePBlicoDeliveryService';
import { MeiosDePagamentoAdminDeliveryService } from './services/MeiosDePagamentoAdminDeliveryService';
import { MeiosDePagamentoClienteDeliveryService } from './services/MeiosDePagamentoClienteDeliveryService';
import { MetasService } from './services/MetasService';
import { ParceirosAdminDeliveryService } from './services/ParceirosAdminDeliveryService';
import { ParceirosPBlicoDeliveryService } from './services/ParceirosPBlicoDeliveryService';
import { PedidosAdminDeliveryService } from './services/PedidosAdminDeliveryService';
import { PedidosClienteDeliveryService } from './services/PedidosClienteDeliveryService';
import { PrinterDeliveryService } from './services/PrinterDeliveryService';
import { ProdutosAdminDeliveryService } from './services/ProdutosAdminDeliveryService';
import { ProdutosMensuraService } from './services/ProdutosMensuraService';
import { PublicService } from './services/PublicService';
import { RegiEsDeEntregaAdminDeliveryService } from './services/RegiEsDeEntregaAdminDeliveryService';
import { UsuariosService } from './services/UsuariosService';
import { VendasService } from './services/VendasService';
import { VitrinesAdminDeliveryService } from './services/VitrinesAdminDeliveryService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class MensuraApiClient {
    public readonly auth: AuthService;
    public readonly bi: BiService;
    public readonly categoriasAdminDelivery: CategoriasAdminDeliveryService;
    public readonly categoriasClienteDelivery: CategoriasClienteDeliveryService;
    public readonly clienteAdminDelivery: ClienteAdminDeliveryService;
    public readonly clienteClienteDelivery: ClienteClienteDeliveryService;
    public readonly compras: ComprasService;
    public readonly cuponsAdminDelivery: CuponsAdminDeliveryService;
    public readonly dashboard: DashboardService;
    public readonly empresas: EmpresasService;
    public readonly empresasClient: EmpresasClientService;
    public readonly enderecos: EnderecosService;
    public readonly endereOsAdminDelivery: EndereOsAdminDeliveryService;
    public readonly endereOsClienteDelivery: EndereOsClienteDeliveryService;
    public readonly entregadoresAdminDelivery: EntregadoresAdminDeliveryService;
    public readonly geoapify: GeoapifyService;
    public readonly homePBlicoDelivery: HomePBlicoDeliveryService;
    public readonly meiosDePagamentoAdminDelivery: MeiosDePagamentoAdminDeliveryService;
    public readonly meiosDePagamentoClienteDelivery: MeiosDePagamentoClienteDeliveryService;
    public readonly metas: MetasService;
    public readonly parceirosAdminDelivery: ParceirosAdminDeliveryService;
    public readonly parceirosPBlicoDelivery: ParceirosPBlicoDeliveryService;
    public readonly pedidosAdminDelivery: PedidosAdminDeliveryService;
    public readonly pedidosClienteDelivery: PedidosClienteDeliveryService;
    public readonly printerDelivery: PrinterDeliveryService;
    public readonly produtosAdminDelivery: ProdutosAdminDeliveryService;
    public readonly produtosMensura: ProdutosMensuraService;
    public readonly public: PublicService;
    public readonly regiEsDeEntregaAdminDelivery: RegiEsDeEntregaAdminDeliveryService;
    public readonly usuarios: UsuariosService;
    public readonly vendas: VendasService;
    public readonly vitrinesAdminDelivery: VitrinesAdminDeliveryService;
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
        this.auth = new AuthService(this.request);
        this.bi = new BiService(this.request);
        this.categoriasAdminDelivery = new CategoriasAdminDeliveryService(this.request);
        this.categoriasClienteDelivery = new CategoriasClienteDeliveryService(this.request);
        this.clienteAdminDelivery = new ClienteAdminDeliveryService(this.request);
        this.clienteClienteDelivery = new ClienteClienteDeliveryService(this.request);
        this.compras = new ComprasService(this.request);
        this.cuponsAdminDelivery = new CuponsAdminDeliveryService(this.request);
        this.dashboard = new DashboardService(this.request);
        this.empresas = new EmpresasService(this.request);
        this.empresasClient = new EmpresasClientService(this.request);
        this.enderecos = new EnderecosService(this.request);
        this.endereOsAdminDelivery = new EndereOsAdminDeliveryService(this.request);
        this.endereOsClienteDelivery = new EndereOsClienteDeliveryService(this.request);
        this.entregadoresAdminDelivery = new EntregadoresAdminDeliveryService(this.request);
        this.geoapify = new GeoapifyService(this.request);
        this.homePBlicoDelivery = new HomePBlicoDeliveryService(this.request);
        this.meiosDePagamentoAdminDelivery = new MeiosDePagamentoAdminDeliveryService(this.request);
        this.meiosDePagamentoClienteDelivery = new MeiosDePagamentoClienteDeliveryService(this.request);
        this.metas = new MetasService(this.request);
        this.parceirosAdminDelivery = new ParceirosAdminDeliveryService(this.request);
        this.parceirosPBlicoDelivery = new ParceirosPBlicoDeliveryService(this.request);
        this.pedidosAdminDelivery = new PedidosAdminDeliveryService(this.request);
        this.pedidosClienteDelivery = new PedidosClienteDeliveryService(this.request);
        this.printerDelivery = new PrinterDeliveryService(this.request);
        this.produtosAdminDelivery = new ProdutosAdminDeliveryService(this.request);
        this.produtosMensura = new ProdutosMensuraService(this.request);
        this.public = new PublicService(this.request);
        this.regiEsDeEntregaAdminDelivery = new RegiEsDeEntregaAdminDeliveryService(this.request);
        this.usuarios = new UsuariosService(this.request);
        this.vendas = new VendasService(this.request);
        this.vitrinesAdminDelivery = new VitrinesAdminDeliveryService(this.request);
    }
}

