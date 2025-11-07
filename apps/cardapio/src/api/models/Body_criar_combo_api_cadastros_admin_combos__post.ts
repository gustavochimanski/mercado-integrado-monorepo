/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_criar_combo_api_cadastros_admin_combos__post = {
    empresa_id: number;
    titulo: string;
    descricao: string;
    preco_total: number;
    ativo?: boolean;
    /**
     * JSON de itens: [{produto_cod_barras, quantidade}]
     */
    itens: string;
    imagem?: (Blob | null);
};

