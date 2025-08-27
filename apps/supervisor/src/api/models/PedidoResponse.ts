/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemPedidoResponse } from './ItemPedidoResponse';
import type { OrigemPedidoEnum } from './OrigemPedidoEnum';
import type { PedidoStatusEnum } from './PedidoStatusEnum';
import type { TipoEntregaEnum } from './TipoEntregaEnum';
export type PedidoResponse = {
    id: number;
    status: PedidoStatusEnum;
    telefone_cliente?: (string | null);
    empresa_id: number;
    entregador_id: (number | null);
    endereco_id: (number | null);
    tipo_entrega: TipoEntregaEnum;
    origem: OrigemPedidoEnum;
    subtotal: number;
    desconto: number;
    taxa_entrega: number;
    taxa_servico: number;
    valor_total: number;
    previsao_entrega?: (string | null);
    distancia_km?: (number | null);
    observacao_geral?: (string | null);
    troco_para?: (number | null);
    cupom_id?: (number | null);
    data_criacao: string;
    data_atualizacao: string;
    itens: Array<ItemPedidoResponse>;
};

