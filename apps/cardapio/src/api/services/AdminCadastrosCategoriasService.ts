/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AtualizarCategoriaRequest } from '../models/AtualizarCategoriaRequest';
import type { CategoriaArvoreResponse } from '../models/CategoriaArvoreResponse';
import type { CategoriaListItem } from '../models/CategoriaListItem';
import type { CategoriaResponse } from '../models/CategoriaResponse';
import type { CategoriasPaginadasResponse } from '../models/CategoriasPaginadasResponse';
import type { CriarCategoriaRequest } from '../models/CriarCategoriaRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminCadastrosCategoriasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
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
}
