/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnderecoCreate } from './EnderecoCreate';
export type EmpresaCreate = {
    nome: string;
    cnpj?: (string | null);
    slug: string;
    logo?: (string | null);
    endereco: EnderecoCreate;
};

