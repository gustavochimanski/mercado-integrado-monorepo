/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AuthService } from './services/AuthService';
import { BiService } from './services/BiService';
import { CategoriasAdminService } from './services/CategoriasAdminService';
import { CategoriasClienteService } from './services/CategoriasClienteService';
import { ClienteAdminService } from './services/ClienteAdminService';
import { ClienteClienteService } from './services/ClienteClienteService';
import { ComprasService } from './services/ComprasService';
import { CuponsAdminService } from './services/CuponsAdminService';
import { DashboardService } from './services/DashboardService';
import { EmpresasService } from './services/EmpresasService';
import { EmpresasClientService } from './services/EmpresasClientService';
import { EnderecosService } from './services/EnderecosService';
import { EndereOsAdminService } from './services/EndereOsAdminService';
import { EndereOsClienteService } from './services/EndereOsClienteService';
import { EntregadoresAdminService } from './services/EntregadoresAdminService';
import { GeoapifyService } from './services/GeoapifyService';
import { HomePBlicoService } from './services/HomePBlicoService';
import { ImpressorasService } from './services/ImpressorasService';
import { MeiosDePagamentoAdminService } from './services/MeiosDePagamentoAdminService';
import { MeiosDePagamentoClienteService } from './services/MeiosDePagamentoClienteService';
import { MetasService } from './services/MetasService';
import { ParceirosPBlicoService } from './services/ParceirosPBlicoService';
import { PedidosAdminService } from './services/PedidosAdminService';
import { PedidosClienteService } from './services/PedidosClienteService';
import { PrinterService } from './services/PrinterService';
import { ProdutosAdminService } from './services/ProdutosAdminService';
import { ProdutosDeliveryService } from './services/ProdutosDeliveryService';
import { PublicService } from './services/PublicService';
import { RegiEsDeEntregaAdminService } from './services/RegiEsDeEntregaAdminService';
import { UsuariosService } from './services/UsuariosService';
import { VendasService } from './services/VendasService';
import { VitrinesAdminService } from './services/VitrinesAdminService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class MensuraApiClient {
    public readonly auth: AuthService;
    public readonly bi: BiService;
    public readonly categoriasAdmin: CategoriasAdminService;
    public readonly categoriasCliente: CategoriasClienteService;
    public readonly clienteAdmin: ClienteAdminService;
    public readonly clienteCliente: ClienteClienteService;
    public readonly compras: ComprasService;
    public readonly cuponsAdmin: CuponsAdminService;
    public readonly dashboard: DashboardService;
    public readonly empresas: EmpresasService;
    public readonly empresasClient: EmpresasClientService;
    public readonly enderecos: EnderecosService;
    public readonly endereOsAdmin: EndereOsAdminService;
    public readonly endereOsCliente: EndereOsClienteService;
    public readonly entregadoresAdmin: EntregadoresAdminService;
    public readonly geoapify: GeoapifyService;
    public readonly homePBlico: HomePBlicoService;
    public readonly impressoras: ImpressorasService;
    public readonly meiosDePagamentoAdmin: MeiosDePagamentoAdminService;
    public readonly meiosDePagamentoCliente: MeiosDePagamentoClienteService;
    public readonly metas: MetasService;
    public readonly parceirosPBlico: ParceirosPBlicoService;
    public readonly pedidosAdmin: PedidosAdminService;
    public readonly pedidosCliente: PedidosClienteService;
    public readonly printer: PrinterService;
    public readonly produtosAdmin: ProdutosAdminService;
    public readonly produtosDelivery: ProdutosDeliveryService;
    public readonly public: PublicService;
    public readonly regiEsDeEntregaAdmin: RegiEsDeEntregaAdminService;
    public readonly usuarios: UsuariosService;
    public readonly vendas: VendasService;
    public readonly vitrinesAdmin: VitrinesAdminService;
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
        this.categoriasAdmin = new CategoriasAdminService(this.request);
        this.categoriasCliente = new CategoriasClienteService(this.request);
        this.clienteAdmin = new ClienteAdminService(this.request);
        this.clienteCliente = new ClienteClienteService(this.request);
        this.compras = new ComprasService(this.request);
        this.cuponsAdmin = new CuponsAdminService(this.request);
        this.dashboard = new DashboardService(this.request);
        this.empresas = new EmpresasService(this.request);
        this.empresasClient = new EmpresasClientService(this.request);
        this.enderecos = new EnderecosService(this.request);
        this.endereOsAdmin = new EndereOsAdminService(this.request);
        this.endereOsCliente = new EndereOsClienteService(this.request);
        this.entregadoresAdmin = new EntregadoresAdminService(this.request);
        this.geoapify = new GeoapifyService(this.request);
        this.homePBlico = new HomePBlicoService(this.request);
        this.impressoras = new ImpressorasService(this.request);
        this.meiosDePagamentoAdmin = new MeiosDePagamentoAdminService(this.request);
        this.meiosDePagamentoCliente = new MeiosDePagamentoClienteService(this.request);
        this.metas = new MetasService(this.request);
        this.parceirosPBlico = new ParceirosPBlicoService(this.request);
        this.pedidosAdmin = new PedidosAdminService(this.request);
        this.pedidosCliente = new PedidosClienteService(this.request);
        this.printer = new PrinterService(this.request);
        this.produtosAdmin = new ProdutosAdminService(this.request);
        this.produtosDelivery = new ProdutosDeliveryService(this.request);
        this.public = new PublicService(this.request);
        this.regiEsDeEntregaAdmin = new RegiEsDeEntregaAdminService(this.request);
        this.usuarios = new UsuariosService(this.request);
        this.vendas = new VendasService(this.request);
        this.vitrinesAdmin = new VitrinesAdminService(this.request);
    }
}

