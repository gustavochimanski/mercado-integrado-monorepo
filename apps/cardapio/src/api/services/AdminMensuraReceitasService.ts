/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdicionalIn } from '../models/AdicionalIn';
import type { AdicionalOut } from '../models/AdicionalOut';
import type { Body_update_ingrediente_api_mensura_admin_receitas_ingredientes__ingrediente_id__put } from '../models/Body_update_ingrediente_api_mensura_admin_receitas_ingredientes__ingrediente_id__put';
import type { IngredienteIn } from '../models/IngredienteIn';
import type { IngredienteOut } from '../models/IngredienteOut';
import type { SetDiretivaRequest } from '../models/SetDiretivaRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminMensuraReceitasService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Set Diretiva
     * @param codBarras Código de barras do produto
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public setDiretivaApiMensuraAdminReceitasCodBarrasDiretivaPut(
        codBarras: string,
        requestBody: SetDiretivaRequest,
    ): CancelablePromise<Record<string, any>> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/admin/receitas/{cod_barras}/diretiva',
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
     * List Ingredientes
     * @param codBarras Código de barras do produto
     * @returns IngredienteOut Successful Response
     * @throws ApiError
     */
    public listIngredientesApiMensuraAdminReceitasCodBarrasIngredientesGet(
        codBarras: string,
    ): CancelablePromise<Array<IngredienteOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/receitas/{cod_barras}/ingredientes',
            path: {
                'cod_barras': codBarras,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Ingrediente
     * @param requestBody
     * @returns IngredienteOut Successful Response
     * @throws ApiError
     */
    public addIngredienteApiMensuraAdminReceitasIngredientesPost(
        requestBody: IngredienteIn,
    ): CancelablePromise<IngredienteOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mensura/admin/receitas/ingredientes',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Ingrediente
     * @param ingredienteId
     * @param requestBody
     * @returns IngredienteOut Successful Response
     * @throws ApiError
     */
    public updateIngredienteApiMensuraAdminReceitasIngredientesIngredienteIdPut(
        ingredienteId: number,
        requestBody?: Body_update_ingrediente_api_mensura_admin_receitas_ingredientes__ingrediente_id__put,
    ): CancelablePromise<IngredienteOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/admin/receitas/ingredientes/{ingrediente_id}',
            path: {
                'ingrediente_id': ingredienteId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Ingrediente
     * @param ingredienteId
     * @returns void
     * @throws ApiError
     */
    public removeIngredienteApiMensuraAdminReceitasIngredientesIngredienteIdDelete(
        ingredienteId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mensura/admin/receitas/ingredientes/{ingrediente_id}',
            path: {
                'ingrediente_id': ingredienteId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Adicionais
     * @param codBarras
     * @returns AdicionalOut Successful Response
     * @throws ApiError
     */
    public listAdicionaisApiMensuraAdminReceitasCodBarrasAdicionaisGet(
        codBarras: string,
    ): CancelablePromise<Array<AdicionalOut>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/admin/receitas/{cod_barras}/adicionais',
            path: {
                'cod_barras': codBarras,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Adicional
     * @param requestBody
     * @returns AdicionalOut Successful Response
     * @throws ApiError
     */
    public addAdicionalApiMensuraAdminReceitasAdicionaisPost(
        requestBody: AdicionalIn,
    ): CancelablePromise<AdicionalOut> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mensura/admin/receitas/adicionais',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Adicional
     * @param adicionalId
     * @param requestBody
     * @returns AdicionalOut Successful Response
     * @throws ApiError
     */
    public updateAdicionalApiMensuraAdminReceitasAdicionaisAdicionalIdPut(
        adicionalId: number,
        requestBody?: (number | null),
    ): CancelablePromise<AdicionalOut> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/admin/receitas/adicionais/{adicional_id}',
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
     * Remove Adicional
     * @param adicionalId
     * @returns void
     * @throws ApiError
     */
    public removeAdicionalApiMensuraAdminReceitasAdicionaisAdicionalIdDelete(
        adicionalId: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mensura/admin/receitas/adicionais/{adicional_id}',
            path: {
                'adicional_id': adicionalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
