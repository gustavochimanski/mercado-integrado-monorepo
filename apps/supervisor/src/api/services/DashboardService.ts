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
     * Dashboard Visão panorâmica
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public dashboardControllerApiBiDashboardPeriodoPost(
        requestBody: TypeDashboardRequest,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/bi/dashboard/periodo',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
