/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BannerParceiroOut } from './BannerParceiroOut';
import type { CupomParceiroOut } from './CupomParceiroOut';
export type ParceiroCompletoOut = {
    id: number;
    nome: string;
    ativo: boolean;
    telefone: (string | null);
    cupons?: Array<CupomParceiroOut>;
    banners?: Array<BannerParceiroOut>;
};

