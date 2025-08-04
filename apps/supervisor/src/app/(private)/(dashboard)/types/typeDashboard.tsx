import { TypeTotaisPorDepartamento } from "../components/departamento/DashCardParticipacaoDepartamento";
import { TypeComprasGeralResponse } from "./typeCompras";
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

type TypeRelacao = {
  relacaoValue: number;
  relacaoPorcentagem: number;
};

type TypeVendaDetalhadaByDate = {
  data: string;
  valor: number;
};

type TypeVendaDetalhadaEmpresas = {
  empresa: CodEmpresa;
  dates: TypeVendaDetalhadaByDate[];
};

export type TypeVendaDetalhadaResponse = {
  empresas: CodEmpresa[];
  dataInicio: string;
  dataFinal: string;
  vendaEmpresas: TypeVendaDetalhadaEmpresas[];
};

type TypeCompraDetalhadaByDate = {
  data: string;
  valor: number;
};

type TypeCompraDetalhadaEmpresas = {
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
  periodo_anterior: TotaisPorEmpresa[]
  metas: TypeDashboardMetaHeader;
  relacao: TypeRelacao;
  compras: TypeComprasGeralResponse;
  vendaDetalhada: TypeVendaDetalhadaResponse;
  compraDetalhada: TypeCompraDetalhadaResponse;
  vendaPorHora: TypeVendaPorHoraResponse;
  meios_pagamento: MeiosPagamento;
  departamentos: TypeTotaisPorDepartamento[]
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
