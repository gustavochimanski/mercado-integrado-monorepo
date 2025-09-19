/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EnderecoUpdateAdmin = {
    acao: EnderecoUpdateAdmin.acao;
    id?: (number | null);
    cep?: (string | null);
    logradouro?: (string | null);
    numero?: (string | null);
    complemento?: (string | null);
    bairro?: (string | null);
    cidade?: (string | null);
    estado?: (string | null);
    ponto_referencia?: (string | null);
    latitude?: (number | null);
    longitude?: (number | null);
    is_principal?: (boolean | null);
};
export namespace EnderecoUpdateAdmin {
    export enum acao {
        ADD = 'add',
        UPDATE = 'update',
        REMOVE = 'remove',
    }
}

