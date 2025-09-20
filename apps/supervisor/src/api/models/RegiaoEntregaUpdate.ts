/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegiaoEntregaUpdate = {
    cep?: (string | null);
    bairro: string;
    cidade: string;
    uf: string;
    taxa_entrega: (number | string);
    /**
     * Raio de cobertura em km
     */
    raio_km?: (number | string | null);
    ativo?: boolean;
    latitude?: (number | null);
    longitude?: (number | null);
};

