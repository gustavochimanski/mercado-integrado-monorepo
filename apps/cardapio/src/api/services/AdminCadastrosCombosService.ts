/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_atualizar_combo_api_cadastros_admin_combos__combo_id__put } from '../models/Body_atualizar_combo_api_cadastros_admin_combos__combo_id__put';
import type { Body_criar_combo_api_cadastros_admin_combos__post } from '../models/Body_criar_combo_api_cadastros_admin_combos__post';
import type { ComboDTO } from '../models/ComboDTO';
import type { ListaCombosResponse } from '../models/ListaCombosResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminCadastrosCombosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
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
}
