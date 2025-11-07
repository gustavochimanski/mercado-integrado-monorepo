/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CaixaConferenciaResumoResponse } from '../models/CaixaConferenciaResumoResponse';
import type { CaixaCreate } from '../models/CaixaCreate';
import type { CaixaFechamentoRequest } from '../models/CaixaFechamentoRequest';
import type { CaixaResponse } from '../models/CaixaResponse';
import type { CaixaResumoResponse } from '../models/CaixaResumoResponse';
import type { CaixaValoresEsperadosResponse } from '../models/CaixaValoresEsperadosResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminCaixasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
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
}
