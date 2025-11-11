/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusPedidoMesaEnum } from './StatusPedidoMesaEnum';
export type MesaPedidoResumo = {
    id: number;
    numero_pedido: string;
    status: StatusPedidoMesaEnum;
    num_pessoas?: (number | null);
    valor_total: number;
    cliente_id?: (number | null);
    cliente_nome?: (string | null);
};

