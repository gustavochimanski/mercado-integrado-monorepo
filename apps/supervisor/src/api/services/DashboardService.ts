/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TypeDashboardRequest } from '../models/TypeDashboardRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DashboardService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Dados Dashboard geral
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public dashboardControllerBiDashboardPeriodoPost(
        requestBody: TypeDashboardRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/bi/dashboard/periodo',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
