/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TotaisGerais } from './TotaisGerais';
import type { TotaisPorEmpresa } from './TotaisPorEmpresa';
export type TypeResumoVendasResponse = {
    totais_por_empresa: Array<TotaisPorEmpresa>;
    total_geral: TotaisGerais;
    periodo_anterior: Array<TotaisPorEmpresa>;
};

