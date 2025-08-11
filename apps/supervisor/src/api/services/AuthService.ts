/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
    public loginUsuarioAuthTokenPost(
        requestBody: LoginRequest,
    ): CancelablePromise<TokenResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/token',
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
    public obterUsuarioAtualAuthMeGet(): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/me',
        });
    }
}
