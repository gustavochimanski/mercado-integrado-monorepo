/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DadosEmpresaPrinter } from './DadosEmpresaPrinter';
import type { ItemPedidoPrinter } from './ItemPedidoPrinter';
/**
 * Resposta formatada para pedidos pendentes de impressão
 */
export type PedidoPendenteImpressaoResponse = {
    /**
     * Número do pedido
     */
    numero: number;
    /**
     * Status do pedido
     */
    status: string;
    /**
     * Nome do cliente
     */
    cliente: string;
    /**
     * Telefone do cliente
     */
    telefone_cliente?: (string | null);
    /**
     * Lista de itens do pedido
     */
    itens: Array<ItemPedidoPrinter>;
    /**
     * Subtotal do pedido
     */
    subtotal: number;
    /**
     * Valor do desconto
     */
    desconto?: number;
    /**
     * Taxa de entrega
     */
    taxa_entrega?: number;
    /**
     * Taxa de serviço
     */
    taxa_servico?: number;
    /**
     * Valor total do pedido
     */
    total: number;
    /**
     * Tipo de pagamento
     */
    tipo_pagamento: string;
    /**
     * Valor do troco
     */
    troco?: (number | null);
    /**
     * Observação geral do pedido
     */
    observacao_geral?: (string | null);
    /**
     * Endereço de entrega
     */
    endereco?: (string | null);
    /**
     * Data de criação do pedido
     */
    data_criacao: string;
    /**
     * Dados da empresa
     */
    empresa: DadosEmpresaPrinter;
};

