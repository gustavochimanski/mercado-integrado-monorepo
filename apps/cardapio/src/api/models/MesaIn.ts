/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusMesaEnum } from './StatusMesaEnum';
/**
 * Schema para criação de mesa
 */
export type MesaIn = {
    /**
     * Código numérico da mesa (número real)
     */
    codigo: (number | string);
    descricao?: (string | null);
    capacidade?: (number | null);
    status?: (StatusMesaEnum | null);
    ativa?: (string | null);
};

