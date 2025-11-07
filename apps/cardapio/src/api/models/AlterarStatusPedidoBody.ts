/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PedidoStatusEnum } from './PedidoStatusEnum';
export type AlterarStatusPedidoBody = {
    status: PedidoStatusEnum;
    motivo?: (string | null);
    observacoes?: (string | null);
    criado_por?: (string | null);
    ip_origem?: (string | null);
    user_agent?: (string | null);
};

