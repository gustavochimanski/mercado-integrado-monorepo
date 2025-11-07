/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HistoricoDaMesaResponse } from '../models/HistoricoDaMesaResponse';
import type { MesaIn } from '../models/MesaIn';
import type { MesaListOut } from '../models/MesaListOut';
import type { MesaOut } from '../models/MesaOut';
import type { MesaSearchOut } from '../models/MesaSearchOut';
import type { MesaStatsOut } from '../models/MesaStatsOut';
import type { MesaStatusUpdate } from '../models/MesaStatusUpdate';
import type { MesaUpdate } from '../models/MesaUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminMesasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
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
}
