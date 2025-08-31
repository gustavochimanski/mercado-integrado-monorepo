/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PedidoStatusEnum } from './PedidoStatusEnum';
export type PedidoKanbanResponse = {
    id: number;
    status: PedidoStatusEnum;
    telefone_cliente?: (string | null);
    nome_cliente?: (string | null);
    valor_total: number;
    data_criacao: string;
    endereco_cliente?: (string | null);
};

