/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmpresaMiniOut } from './EmpresaMiniOut';
export type EntregadorOut = {
    id: number;
    nome: string;
    telefone: (string | null);
    documento: (string | null);
    veiculo_tipo: (string | null);
    placa: (string | null);
    acrescimo_taxa: (number | null);
    valor_diaria: (number | null);
    created_at: string;
    updated_at: string;
    empresas?: Array<EmpresaMiniOut>;
};

