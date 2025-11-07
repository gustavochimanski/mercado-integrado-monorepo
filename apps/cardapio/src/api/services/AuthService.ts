/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClienteMeResponse } from '../models/ClienteMeResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { TokenResponse } from '../models/TokenResponse';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Login Usuario
     * @param requestBody
     * @returns TokenResponse Successful Response
     * @throws ApiError
     */
    public loginUsuarioApiAuthTokenPost(
        requestBody: LoginRequest,
    ): CancelablePromise<TokenResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/auth/token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Retorna o usuário atual baseado no token JWT
     * Puxa o usuário já autenticado pelo get_current_user e devolve seus campos.
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public obterUsuarioAtualApiAuthMeGet(): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/auth/me',
        });
    }
    /**
     * Retorna o Cliente atual baseado no x-super-token
     * Puxa o Cliente já autenticado pelo get_cliente_by_super_token (header X-Super-Token) e retorna apenas nome, token e telefone.
     * @param xSuperToken
     * @returns ClienteMeResponse Successful Response
     * @throws ApiError
     */
    public obterClienteAtualApiAuthClientMeGet(
        xSuperToken: string,
    ): CancelablePromise<ClienteMeResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/auth/client/me',
            headers: {
                'x-super-token': xSuperToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
