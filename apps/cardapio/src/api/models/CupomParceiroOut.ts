/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CupomLinkOut } from './CupomLinkOut';
export type CupomParceiroOut = {
    id: number;
    codigo: string;
    descricao: (string | null);
    desconto_valor: (number | null);
    desconto_percentual: (number | null);
    ativo: boolean;
    monetizado: boolean;
    valor_por_lead: (number | null);
    links?: Array<CupomLinkOut>;
};

