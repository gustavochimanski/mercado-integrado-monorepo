/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CupomCreate = {
    codigo: string;
    descricao?: (string | null);
    desconto_valor?: (number | null);
    desconto_percentual?: (number | null);
    ativo?: boolean;
    validade_inicio?: (string | null);
    validade_fim?: (string | null);
    monetizado?: boolean;
    valor_por_lead?: (number | null);
    parceiro_id?: (number | null);
    link_redirecionamento?: (string | null);
    empresa_ids: Array<number>;
};

