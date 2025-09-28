/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemPedidoResponse } from './ItemPedidoResponse';
import type { PedidoStatusEnum } from './PedidoStatusEnum';
/**
 * Schema simplificado para listagem de pedidos do cliente
 */
export type PedidoResponseSimplificado = {
    id: number;
    status: PedidoStatusEnum;
    cliente_nome: string;
    cliente_telefone?: (string | null);
    subtotal: number;
    desconto: number;
    taxa_entrega: number;
    taxa_servico: number;
    valor_total: number;
    previsao_entrega?: (string | null);
    observacao_geral?: (string | null);
    troco_para?: (number | null);
    endereco_snapshot?: (Record<string, any> | null);
    data_criacao: string;
    data_atualizacao: string;
    itens: Array<ItemPedidoResponse>;
    meio_pagamento_nome?: (string | null);
};

