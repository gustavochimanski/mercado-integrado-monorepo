/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClienteOut } from './ClienteOut';
import type { CupomOut } from './CupomOut';
import type { EmpresaResponse } from './EmpresaResponse';
import type { EnderecoOut } from './EnderecoOut';
import type { EntregadorOut } from './EntregadorOut';
import type { ItemPedidoResponse } from './ItemPedidoResponse';
import type { MeioPagamentoResponse } from './MeioPagamentoResponse';
import type { OrigemPedidoEnum } from './OrigemPedidoEnum';
import type { PedidoStatusEnum } from './PedidoStatusEnum';
import type { PedidoStatusHistoricoOut } from './PedidoStatusHistoricoOut';
import type { TipoEntregaEnum } from './TipoEntregaEnum';
import type { TransacaoOut } from './TransacaoOut';
export type PedidoResponseCompletoTotal = {
    id: number;
    status: PedidoStatusEnum;
    cliente?: (ClienteOut | null);
    endereco?: (EnderecoOut | null);
    empresa?: (EmpresaResponse | null);
    entregador?: (EntregadorOut | null);
    meio_pagamento?: (MeioPagamentoResponse | null);
    cupom?: (CupomOut | null);
    transacao?: (TransacaoOut | null);
    historicos?: Array<PedidoStatusHistoricoOut>;
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
    endereco_snapshot?: (Record<string, any> | null);
    endereco_geography?: (string | null);
    data_criacao: string;
    data_atualizacao: string;
    itens: Array<ItemPedidoResponse>;
};

