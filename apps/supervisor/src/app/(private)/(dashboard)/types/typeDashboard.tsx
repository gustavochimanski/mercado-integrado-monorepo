import { TypeTotaisPorDepartamento } from "../components/departamento/ComponentPartPorDepartamento";
import { TypeComprasGeralResponse } from "./typeCompras";
import { PorEmpresaDepartamentos } from "./typeDepartamento";
import { TypeDashboardMetaHeader } from "./typeMetas";
import { TypeVendaPorHoraResponse } from "./typeVendasPorHora";

/**
 * Alias para código de empresa
 */
export type CodEmpresa = string;

/**
 * Totais por empresa retornados pela API do dashboard de vendas
 */
export type TotaisPorEmpresa = {
  lcpr_codempresa: CodEmpresa;
  empr_nomereduzido: string;
  total_cupons: number;
  total_vendas: number;
  ticket_medio: number;
};

/**
 * Totais gerais de vendas
 */
export type TotaisGerais = {
  total_cupons: number;
  total_vendas: number;
  ticket_medio: number;
};

/**
 * Relação geral de vendas vs compras
 */
export type TypeRelacao = {
  total_vendas: number;
  total_compras: number;
  relacaoValue: number;
  relacaoPorcentagem: number;
};

/**
 * Relação de margem por empresa
 */
export type TypeRelacaoEmpresa = {
  empresa: CodEmpresa;
  total_vendas: number;
  total_compras: number;
  relacaoValue: number;
  relacaoPorcentagem: number;
};

/**
 * Detalhamento de vendas por data
 */
export type TypeVendaDetalhadaByDate = {
  data: string;
  valor: number;
};

export type TypeVendaDetalhadaEmpresas = {
  empresa: CodEmpresa;
  dates: TypeVendaDetalhadaByDate[];
};

export type TypeVendaDetalhadaResponse = {
  empresas: CodEmpresa[];
  dataInicio: string;
  dataFinal: string;
  vendaEmpresas: TypeVendaDetalhadaEmpresas[];
};

export type TypeCompraDetalhadaByDate = {
  data: string;
  valor: number;
};

export type TypeCompraDetalhadaEmpresas = {
  empresa: CodEmpresa;
  dates: TypeCompraDetalhadaByDate[];
};

export type TypeCompraDetalhadaResponse = {
  empresas: CodEmpresa[];
  dataInicio: string;
  dataFinal: string;
  compraEmpresas: TypeCompraDetalhadaEmpresas[];
};

export type TypeMeioPgtoResponseDash = {
  tipo: string;
  descricao: string;
  valor_total: number;
  empresa?: CodEmpresa;
};

export type MeiosPorEmpresa = {
  empresa: CodEmpresa;
  meios: TypeMeioPgtoResponseDash[];
};

export type MeiosPagamento = {
  total_geral: TypeMeioPgtoResponseDash[];
  por_empresa: MeiosPorEmpresa[];
};

export type TypeDashboardResponse = {
  totais_por_empresa: TotaisPorEmpresa[];
  total_geral: TotaisGerais;
  periodo_anterior: TotaisPorEmpresa[];
  metas: TypeDashboardMetaHeader;
  relacao: TypeRelacao;
  relacao_por_empresa: TypeRelacaoEmpresa[];
  compras: TypeComprasGeralResponse;
  vendaDetalhada: TypeVendaDetalhadaResponse;
  compraDetalhada: TypeCompraDetalhadaResponse;
  vendaPorHora: TypeVendaPorHoraResponse;
  meios_pagamento: MeiosPagamento;
  departamento_geral: TypeTotaisPorDepartamento[];
  departamento_empresa: PorEmpresaDepartamentos[];
};

/**
 * Filtros usados no dashboard (payload enviado)
 */
export type TypeFiltroDashboard = {
  empresas: any;
  dataInicio: string;
  dataFinal: string;
  situacao?: string;
  status_venda?: string;
  cod_vendedor?: string;
};
