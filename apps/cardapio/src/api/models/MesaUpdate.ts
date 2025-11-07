/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusMesaEnum } from './StatusMesaEnum';
/**
 * Schema para atualização de mesa
 */
export type MesaUpdate = {
    /**
     * Código numérico da mesa (número real)
     */
    codigo?: (number | string | null);
    numero?: (string | null);
    descricao?: (string | null);
    capacidade?: (number | null);
    status?: (StatusMesaEnum | null);
    ativa?: (string | null);
};

