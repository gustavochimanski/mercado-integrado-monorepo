/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserCreate } from '../models/UserCreate';
import type { UserResponse } from '../models/UserResponse';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UsuariosService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create User
     * @param requestBody
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public createUserApiMensuraUsuariosPost(
        requestBody: UserCreate,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/mensura/usuarios/',
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
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public listUsersApiMensuraUsuariosGet(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<Array<UserResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/usuarios/',
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
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public getUserApiMensuraUsuariosIdGet(
        id: number,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/usuarios/{id}',
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
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public updateUserApiMensuraUsuariosIdPut(
        id: number,
        requestBody: UserUpdate,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/mensura/usuarios/{id}',
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
    public deleteUserApiMensuraUsuariosIdDelete(
        id: number,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/mensura/usuarios/{id}',
            path: {
                'id': id,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
