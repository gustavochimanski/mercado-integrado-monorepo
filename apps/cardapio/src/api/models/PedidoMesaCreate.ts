/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PedidoMesaItemIn } from './PedidoMesaItemIn';
export type PedidoMesaCreate = {
    /**
     * Código numérico da mesa (número real). O sistema buscará a mesa pelo código (campo 'codigo'), não pelo ID.
     */
    mesa_id: number;
    cliente_id?: (number | null);
    observacoes?: (string | null);
    /**
     * Número de pessoas na mesa; opcional. Informe quando desejar registrar o total de pessoas atendidas.
     */
    num_pessoas?: (number | null);
    itens?: (Array<PedidoMesaItemIn> | null);
};

