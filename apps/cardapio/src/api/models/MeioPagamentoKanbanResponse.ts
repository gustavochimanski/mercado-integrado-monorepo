/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MeioPagamentoTipoEnum } from './MeioPagamentoTipoEnum';
/**
 * Schema simplificado para meio de pagamento no kanban (sem timestamps)
 */
export type MeioPagamentoKanbanResponse = {
    id: number;
    nome: string;
    tipo: MeioPagamentoTipoEnum;
    ativo: boolean;
};

