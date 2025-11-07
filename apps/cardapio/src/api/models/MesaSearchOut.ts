/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusMesaEnum } from './StatusMesaEnum';
/**
 * Schema para busca de mesas
 */
export type MesaSearchOut = {
    id: number;
    codigo: string;
    numero: string;
    descricao?: (string | null);
    capacidade: number;
    status: StatusMesaEnum;
    status_descricao: string;
    ativa: string;
};

