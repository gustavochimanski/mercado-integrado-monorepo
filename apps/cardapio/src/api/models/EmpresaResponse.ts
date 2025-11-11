/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { app__api__cadastros__schemas__schema_endereco__EnderecoOut } from './app__api__cadastros__schemas__schema_endereco__EnderecoOut';
export type EmpresaResponse = {
    nome: string;
    cnpj?: (string | null);
    slug: string;
    logo?: (string | null);
    cardapio_link?: (string | null);
    cardapio_tema?: (string | null);
    aceita_pedido_automatico?: boolean;
    tempo_entrega_maximo: number;
    id: number;
    endereco_id?: (number | null);
    endereco?: (app__api__cadastros__schemas__schema_endereco__EnderecoOut | null);
};

