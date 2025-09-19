/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegiaoEntregaOut = {
    cep?: (string | null);
    bairro: string;
    cidade: string;
    uf: string;
    taxa_entrega: string;
    /**
     * Raio de cobertura em km
     */
    raio_km?: (string | null);
    ativo?: boolean;
    latitude?: (number | null);
    longitude?: (number | null);
    id: number;
};

