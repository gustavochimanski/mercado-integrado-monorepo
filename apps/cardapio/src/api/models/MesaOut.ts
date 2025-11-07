/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusMesaEnum } from './StatusMesaEnum';
/**
 * Schema para retorno de mesa
 */
export type MesaOut = {
    id: number;
    codigo: string;
    numero: string;
    descricao?: (string | null);
    capacidade: number;
    status: StatusMesaEnum;
    status_descricao: string;
    ativa: string;
    label: string;
    is_ocupada: boolean;
    is_disponivel: boolean;
    is_reservada: boolean;
};

