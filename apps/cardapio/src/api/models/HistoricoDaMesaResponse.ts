/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MesaHistoricoOut } from './MesaHistoricoOut';
/**
 * Resposta com histórico completo da mesa (seguindo padrão do histórico de pedidos)
 */
export type HistoricoDaMesaResponse = {
    mesa_id: number;
    historicos: Array<MesaHistoricoOut>;
};

