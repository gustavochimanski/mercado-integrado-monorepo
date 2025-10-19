/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClientMensuraGeoapifyService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Search Endereco
     * Busca endereço com validação de CEP.
     * Se a query contém um CEP, primeiro consulta o ViaCEP para validar.
     * Depois complementa com busca no Geoapify para obter coordenadas.
     * @param text
     * @param xSuperToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public searchEnderecoApiMensuraClientGeoapifySearchEnderecoGet(
        text: string,
        xSuperToken: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/mensura/client/geoapify/search-endereco',
            headers: {
                'x-super-token': xSuperToken,
            },
            query: {
                'text': text,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
