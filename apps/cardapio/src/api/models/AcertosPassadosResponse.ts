/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResumoAcertoEntregador } from './ResumoAcertoEntregador';
export type AcertosPassadosResponse = {
    empresa_id: number;
    inicio: string;
    fim: string;
    entregador_id?: (number | null);
    resumos?: Array<ResumoAcertoEntregador>;
    total_pedidos: number;
    total_bruto: number;
    total_diarias: number;
    total_liquido: number;
};

