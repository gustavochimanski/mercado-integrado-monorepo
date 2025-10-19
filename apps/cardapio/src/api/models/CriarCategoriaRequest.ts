/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CriarCategoriaRequest = {
    /**
     * Descrição da categoria
     */
    descricao: string;
    /**
     * ID da categoria pai (para subcategorias)
     */
    parent_id?: (number | null);
    /**
     * Status ativo/inativo da categoria
     */
    ativo?: boolean;
};

