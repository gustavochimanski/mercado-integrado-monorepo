/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PagamentoStatusEnum } from './PagamentoStatusEnum';
export type TransacaoStatusUpdateRequest = {
    status: PagamentoStatusEnum;
    provider_transaction_id?: (string | null);
    payload_retorno?: (Record<string, any> | null);
    qr_code?: (string | null);
    qr_code_base64?: (string | null);
};

