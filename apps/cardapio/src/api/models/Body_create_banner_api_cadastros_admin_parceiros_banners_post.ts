/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Body_create_banner_api_cadastros_admin_parceiros_banners_post = {
    nome: string;
    tipo_banner: string;
    ativo: boolean;
    parceiro_id: number;
    categoria_id?: (number | null);
    link_redirecionamento?: (string | null);
    landingpage_store: boolean;
    imagem?: (Blob | null);
};

