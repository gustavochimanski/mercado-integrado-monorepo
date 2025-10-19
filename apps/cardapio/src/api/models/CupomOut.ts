/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmpresaCardapioLinkResponse } from './EmpresaCardapioLinkResponse';
export type CupomOut = {
    id: number;
    codigo: string;
    descricao: (string | null);
    desconto_valor: (number | null);
    desconto_percentual: (number | null);
    ativo: boolean;
    validade_inicio: (string | null);
    validade_fim: (string | null);
    created_at: string;
    updated_at: string;
    monetizado: boolean;
    valor_por_lead: (number | null);
    link_redirecionamento: (string | null);
    empresas: Array<EmpresaCardapioLinkResponse>;
};

