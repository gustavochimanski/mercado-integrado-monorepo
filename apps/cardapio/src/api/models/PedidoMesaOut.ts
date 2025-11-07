/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PedidoMesaItemOut } from './PedidoMesaItemOut';
import type { StatusPedidoMesaEnum } from './StatusPedidoMesaEnum';
export type PedidoMesaOut = {
    id: number;
    numero_pedido: string;
    mesa_id: number;
    cliente_id: (number | null);
    num_pessoas: (number | null);
    status: StatusPedidoMesaEnum;
    status_descricao: string;
    observacoes?: (string | null);
    valor_total: number;
    itens?: Array<PedidoMesaItemOut>;
    created_at?: (string | null);
    updated_at?: (string | null);
};

