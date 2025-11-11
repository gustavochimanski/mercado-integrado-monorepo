/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MesaPedidoResumo } from './MesaPedidoResumo';
import type { StatusMesaEnum } from './StatusMesaEnum';
/**
 * Schema para listagem de mesas
 */
export type MesaListOut = {
    id: number;
    codigo: string;
    numero: string;
    descricao?: (string | null);
    capacidade: number;
    status: StatusMesaEnum;
    status_descricao: string;
    ativa: string;
    label: string;
    num_pessoas_atual?: (number | null);
    cliente_atual_id?: (number | null);
    cliente_atual_nome?: (string | null);
    pedidos_abertos?: Array<MesaPedidoResumo>;
};

