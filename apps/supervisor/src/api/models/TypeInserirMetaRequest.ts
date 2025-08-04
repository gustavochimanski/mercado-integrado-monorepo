/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TypeInserirMetaRequest = {
    empresa: string;
    data: string;
    tipo: TypeInserirMetaRequest.tipo;
    valor: number;
};
export namespace TypeInserirMetaRequest {
    export enum tipo {
        META_VENDA = 'metaVenda',
        LIMITE_COMPRA = 'limiteCompra',
        META_MARGEM = 'metaMargem',
    }
}

