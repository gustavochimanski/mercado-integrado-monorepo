/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PedidoStatusEnum } from './PedidoStatusEnum';
export type PedidoStatusHistoricoOut = {
    id: number;
    pedido_id: number;
    status: PedidoStatusEnum;
    motivo: (string | null);
    criado_em: string;
    criado_por: (string | null);
};

