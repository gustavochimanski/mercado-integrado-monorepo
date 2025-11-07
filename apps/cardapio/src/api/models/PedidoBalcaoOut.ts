/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PedidoBalcaoItemOut } from './PedidoBalcaoItemOut';
import type { StatusPedidoBalcaoEnum } from './StatusPedidoBalcaoEnum';
export type PedidoBalcaoOut = {
    id: number;
    numero_pedido: string;
    mesa_id?: (number | null);
    cliente_id: (number | null);
    status: StatusPedidoBalcaoEnum;
    status_descricao: string;
    observacoes?: (string | null);
    valor_total: number;
    itens?: Array<PedidoBalcaoItemOut>;
    created_at?: (string | null);
    updated_at?: (string | null);
};

