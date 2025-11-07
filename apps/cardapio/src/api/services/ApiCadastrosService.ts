/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdicionalResponse } from '../models/AdicionalResponse';
import type { app__api__delivery__schemas__schema_endereco__EnderecoCreate } from '../models/app__api__delivery__schemas__schema_endereco__EnderecoCreate';
import type { app__api__delivery__schemas__schema_endereco__EnderecoUpdate } from '../models/app__api__delivery__schemas__schema_endereco__EnderecoUpdate';
import type { AtualizarAdicionalRequest } from '../models/AtualizarAdicionalRequest';
import type { AtualizarVitrineRequest } from '../models/AtualizarVitrineRequest';
import type { BannerParceiroIn } from '../models/BannerParceiroIn';
import type { BannerParceiroOut } from '../models/BannerParceiroOut';
import type { Body_atualizar_combo_api_cadastros_admin_combos__combo_id__put } from '../models/Body_atualizar_combo_api_cadastros_admin_combos__combo_id__put';
import type { Body_atualizar_produto_api_cadastros_admin_produtos__cod_barras__put } from '../models/Body_atualizar_produto_api_cadastros_admin_produtos__cod_barras__put';
import type { Body_create_banner_api_cadastros_admin_parceiros_banners_post } from '../models/Body_create_banner_api_cadastros_admin_parceiros_banners_post';
import type { Body_criar_combo_api_cadastros_admin_combos__post } from '../models/Body_criar_combo_api_cadastros_admin_combos__post';
import type { Body_criar_produto_api_cadastros_admin_produtos__post } from '../models/Body_criar_produto_api_cadastros_admin_produtos__post';
import type { Body_upload_imagem_categoria_api_cadastros_admin_categorias__cat_id__imagem_patch } from '../models/Body_upload_imagem_categoria_api_cadastros_admin_categorias__cat_id__imagem_patch';
import type { CategoriaDeliveryIn } from '../models/CategoriaDeliveryIn';
import type { CategoriaDeliveryOut } from '../models/CategoriaDeliveryOut';
import type { CategoriaSearchOut } from '../models/CategoriaSearchOut';
import type { ClienteAdminUpdate } from '../models/ClienteAdminUpdate';
import type { ClienteCreate } from '../models/ClienteCreate';
import type { ClienteOut } from '../models/ClienteOut';
import type { ClienteUpdate } from '../models/ClienteUpdate';
import type { ComboDTO } from '../models/ComboDTO';
import type { CriarAdicionalRequest } from '../models/CriarAdicionalRequest';
import type { CriarNovoProdutoResponse } from '../models/CriarNovoProdutoResponse';
import type { CriarVitrineRequest } from '../models/CriarVitrineRequest';
import type { EnderecoOut } from '../models/EnderecoOut';
import type { EntregadorCreate } from '../models/EntregadorCreate';
import type { EntregadorOut } from '../models/EntregadorOut';
import type { EntregadorUpdate } from '../models/EntregadorUpdate';
import type { ListaCombosResponse } from '../models/ListaCombosResponse';
import type { MeioPagamentoCreate } from '../models/MeioPagamentoCreate';
import type { MeioPagamentoResponse } from '../models/MeioPagamentoResponse';
import type { MeioPagamentoUpdate } from '../models/MeioPagamentoUpdate';
import type { NovoDispositivoRequest } from '../models/NovoDispositivoRequest';
import type { ParceiroCompletoOut } from '../models/ParceiroCompletoOut';
import type { ParceiroIn } from '../models/ParceiroIn';
import type { ParceiroOut } from '../models/ParceiroOut';
import type { ProdutosPaginadosResponse } from '../models/ProdutosPaginadosResponse';
import type { RegiaoEntregaCreate } from '../models/RegiaoEntregaCreate';
import type { RegiaoEntregaOut } from '../models/RegiaoEntregaOut';
import type { RegiaoEntregaUpdate } from '../models/RegiaoEntregaUpdate';
import type { ToggleHomeRequest } from '../models/ToggleHomeRequest';
import type { VincularAdicionaisProdutoRequest } from '../models/VincularAdicionaisProdutoRequest';
import type { VinculoRequest } from '../models/VinculoRequest';
import type { VitrineOut } from '../models/VitrineOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ApiCadastrosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
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
     * @param q Termo de busca por descrição/slug
     * @param limit
     * @param offset
     * @returns CategoriaSearchOut Successful Response
     * @throws ApiError
     */
    public searchCategoriasApiCadastrosClientCategoriasSearchGet(
        xSuperToken: string,
        q?: (string | null),
        limit: number = 30,
        offset?: number,
    ): CancelablePromise<Array<CategoriaSearchOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/client/categorias/search',
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
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
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public getCategoriaApiCadastrosClientCategoriasCatIdGet(
        catId: number,
        xSuperToken: string,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/client/categorias/{cat_id}',
            path: {
                'cat_id': catId,
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
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public listarEnderecosApiCadastrosClientEnderecosGet(
        xSuperToken: string,
    ): CancelablePromise<Array<EnderecoOut>> {
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
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public criarEnderecoApiCadastrosClientEnderecosPost(
        xSuperToken: string,
        requestBody: app__api__delivery__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<EnderecoOut> {
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
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public getEnderecoApiCadastrosClientEnderecosEnderecoIdGet(
        enderecoId: number,
        xSuperToken: string,
    ): CancelablePromise<EnderecoOut> {
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
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public atualizarEnderecoApiCadastrosClientEnderecosEnderecoIdPut(
        enderecoId: number,
        xSuperToken: string,
        requestBody: app__api__delivery__schemas__schema_endereco__EnderecoUpdate,
    ): CancelablePromise<EnderecoOut> {
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
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public setEnderecoPadraoApiCadastrosClientEnderecosEnderecoIdSetPadraoPost(
        enderecoId: number,
        xSuperToken: string,
    ): CancelablePromise<EnderecoOut> {
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
     * Search Categorias
     * @param q Termo de busca por descrição/slug
     * @param limit
     * @param offset
     * @returns CategoriaSearchOut Successful Response
     * @throws ApiError
     */
    public searchCategoriasApiCadastrosAdminCategoriasSearchGet(
        q?: (string | null),
        limit: number = 30,
        offset?: number,
    ): CancelablePromise<Array<CategoriaSearchOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/categorias/search',
            query: {
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
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public getCategoriaApiCadastrosAdminCategoriasCatIdGet(
        catId: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/categorias/{cat_id}',
            path: {
                'cat_id': catId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Editar Categoria
     * @param catId
     * @param requestBody
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public editarCategoriaApiCadastrosAdminCategoriasCatIdPut(
        catId: number,
        requestBody: CategoriaDeliveryIn,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/categorias/{cat_id}',
            path: {
                'cat_id': catId,
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
     * @param catId
     * @returns void
     * @throws ApiError
     */
    public deletarCategoriaApiCadastrosAdminCategoriasCatIdDelete(
        catId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/categorias/{cat_id}',
            path: {
                'cat_id': catId,
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
    public criarCategoriaApiCadastrosAdminCategoriasPost(
        requestBody: CategoriaDeliveryIn,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/categorias',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Move Categoria Direita
     * @param catId
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public moveCategoriaDireitaApiCadastrosAdminCategoriasCatIdMoveRightPost(
        catId: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/categorias/{cat_id}/move-right',
            path: {
                'cat_id': catId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Move Categoria Esquerda
     * @param catId
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public moveCategoriaEsquerdaApiCadastrosAdminCategoriasCatIdMoveLeftPost(
        catId: number,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/categorias/{cat_id}/move-left',
            path: {
                'cat_id': catId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload Imagem Categoria
     * @param catId
     * @param formData
     * @returns CategoriaDeliveryOut Successful Response
     * @throws ApiError
     */
    public uploadImagemCategoriaApiCadastrosAdminCategoriasCatIdImagemPatch(
        catId: number,
        formData: Body_upload_imagem_categoria_api_cadastros_admin_categorias__cat_id__imagem_patch,
    ): CancelablePromise<CategoriaDeliveryOut> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/cadastros/admin/categorias/{cat_id}/imagem',
            path: {
                'cat_id': catId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
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
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public criarEnderecoClienteApiCadastrosAdminClientesClienteIdCriarEnderecoPost(
        clienteId: number,
        requestBody: app__api__delivery__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<EnderecoOut> {
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
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public getEnderecosClienteApiCadastrosAdminClientesClienteIdUpdateEnderecoGet(
        clienteId: number,
    ): CancelablePromise<Array<EnderecoOut>> {
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
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public listarEnderecosAdminApiCadastrosAdminEnderecosClienteClienteIdGet(
        clienteId: number,
    ): CancelablePromise<Array<EnderecoOut>> {
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
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public criarEnderecoAdminApiCadastrosAdminEnderecosClienteClienteIdPost(
        clienteId: number,
        requestBody: app__api__delivery__schemas__schema_endereco__EnderecoCreate,
    ): CancelablePromise<EnderecoOut> {
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
     * @returns EnderecoOut Successful Response
     * @throws ApiError
     */
    public atualizarEnderecoAdminApiCadastrosAdminEnderecosClienteClienteIdEnderecoEnderecoIdPut(
        clienteId: number,
        enderecoId: number,
        requestBody: app__api__delivery__schemas__schema_endereco__EnderecoUpdate,
    ): CancelablePromise<EnderecoOut> {
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
     * Search Vitrines
     * @param q Busca por título/slug
     * @param codCategoria Filtra por categoria vinculada
     * @param isHome Filtra por destaque da home
     * @param limit
     * @param offset
     * @returns VitrineOut Successful Response
     * @throws ApiError
     */
    public searchVitrinesApiCadastrosAdminVitrinesSearchGet(
        q?: (string | null),
        codCategoria?: (number | null),
        isHome?: (boolean | null),
        limit: number = 30,
        offset?: number,
    ): CancelablePromise<Array<VitrineOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/cadastros/admin/vitrines/search',
            query: {
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
     * @param requestBody
     * @returns VitrineOut Successful Response
     * @throws ApiError
     */
    public toggleHomeVitrineApiCadastrosAdminVitrinesVitrineIdHomePatch(
        vitrineId: number,
        requestBody: ToggleHomeRequest,
    ): CancelablePromise<VitrineOut> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/api/cadastros/admin/vitrines/{vitrine_id}/home',
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
     * Criar Vitrine
     * @param requestBody
     * @returns VitrineOut Successful Response
     * @throws ApiError
     */
    public criarVitrineApiCadastrosAdminVitrinesPost(
        requestBody: CriarVitrineRequest,
    ): CancelablePromise<VitrineOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/vitrines',
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
     * @param requestBody
     * @returns VitrineOut Successful Response
     * @throws ApiError
     */
    public atualizarVitrineApiCadastrosAdminVitrinesVitrineIdPut(
        vitrineId: number,
        requestBody: AtualizarVitrineRequest,
    ): CancelablePromise<VitrineOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/cadastros/admin/vitrines/{vitrine_id}',
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
     * Deletar Vitrine
     * @param vitrineId ID da vitrine
     * @returns void
     * @throws ApiError
     */
    public deletarVitrineApiCadastrosAdminVitrinesVitrineIdDelete(
        vitrineId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/vitrines/{vitrine_id}',
            path: {
                'vitrine_id': vitrineId,
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
    public vincularProdutoApiCadastrosAdminVitrinesVitrineIdVincularPost(
        vitrineId: number,
        requestBody: VinculoRequest,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/cadastros/admin/vitrines/{vitrine_id}/vincular',
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
    public desvincularProdutoApiCadastrosAdminVitrinesVitrineIdVincularCodBarrasDelete(
        vitrineId: number,
        codBarras: string,
        empresaId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/cadastros/admin/vitrines/{vitrine_id}/vincular/{cod_barras}',
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
}
