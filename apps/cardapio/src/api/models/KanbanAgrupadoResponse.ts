/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PedidoKanbanResponse } from './PedidoKanbanResponse';
/**
 * Resposta do kanban agrupada por categoria de pedidos
 */
export type KanbanAgrupadoResponse = {
    /**
     * Pedidos de delivery
     */
    delivery?: Array<PedidoKanbanResponse>;
    /**
     * Pedidos de balcão
     */
    balcao?: Array<PedidoKanbanResponse>;
    /**
     * Pedidos de mesas
     */
    mesas?: Array<PedidoKanbanResponse>;
};

