/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_registrar_auditoria_api_notifications_historico_auditoria_post } from '../models/Body_registrar_auditoria_api_notifications_historico_auditoria_post';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class HistoricoService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
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
}
