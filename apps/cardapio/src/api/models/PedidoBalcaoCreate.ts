/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PedidoBalcaoItemIn } from './PedidoBalcaoItemIn';
export type PedidoBalcaoCreate = {
    /**
     * Código numérico da mesa (opcional). Se informado, o sistema buscará a mesa pelo código.
     */
    mesa_id?: (number | null);
    cliente_id?: (number | null);
    observacoes?: (string | null);
    itens?: (Array<PedidoBalcaoItemIn> | null);
};

