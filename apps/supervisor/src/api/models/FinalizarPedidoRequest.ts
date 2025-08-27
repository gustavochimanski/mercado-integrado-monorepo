/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemPedidoRequest } from './ItemPedidoRequest';
import type { OrigemPedidoEnum } from './OrigemPedidoEnum';
import type { TipoEntregaEnum } from './TipoEntregaEnum';
export type FinalizarPedidoRequest = {
    empresa_id: number;
    telefone_cliente?: (string | null);
    endereco_id: number;
    meio_pagamento_id: number;
    tipo_entrega?: TipoEntregaEnum;
    origem?: OrigemPedidoEnum;
    observacao_geral?: (string | null);
    cupom_id?: (number | null);
    troco_para?: (number | string | null);
    itens: Array<ItemPedidoRequest>;
};

