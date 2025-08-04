/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__api__mensura__schemas__usuario_schema__UserResponse } from '../models/app__api__mensura__schemas__usuario_schema__UserResponse';
import type { UserCreate } from '../models/UserCreate';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UsuariosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create User
     * @param requestBody
     * @returns app__api__mensura__schemas__usuario_schema__UserResponse Successful Response
     * @throws ApiError
     */
    public createUserMensuraUsuariosPost(
        requestBody: UserCreate,
    ): CancelablePromise<app__api__mensura__schemas__usuario_schema__UserResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/mensura/usuarios/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Users
     * @param skip
     * @param limit
     * @returns app__api__mensura__schemas__usuario_schema__UserResponse Successful Response
     * @throws ApiError
     */
    public listUsersMensuraUsuariosGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<app__api__mensura__schemas__usuario_schema__UserResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/mensura/usuarios/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User
     * @param id
     * @returns app__api__mensura__schemas__usuario_schema__UserResponse Successful Response
     * @throws ApiError
     */
    public getUserMensuraUsuariosIdGet(
        id: number,
    ): CancelablePromise<app__api__mensura__schemas__usuario_schema__UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/mensura/usuarios/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User
     * @param id
     * @param requestBody
     * @returns app__api__mensura__schemas__usuario_schema__UserResponse Successful Response
     * @throws ApiError
     */
    public updateUserMensuraUsuariosIdPut(
        id: number,
        requestBody: UserUpdate,
    ): CancelablePromise<app__api__mensura__schemas__usuario_schema__UserResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/mensura/usuarios/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * @param id
     * @returns void
     * @throws ApiError
     */
    public deleteUserMensuraUsuariosIdDelete(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/mensura/usuarios/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
