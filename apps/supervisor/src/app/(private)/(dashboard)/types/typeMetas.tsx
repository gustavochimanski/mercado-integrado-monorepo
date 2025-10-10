/**
 * Totais de metas por empresa com tipo de meta
 */
export type TotaisPorEmpresaMeta = {
    codempresa: string;
    tipo: 'metaVenda' | 'limiteCompra' | 'metaMargem'; // categorias conhecidas
    valorMeta: number;
  };
  
  /**
   * Totais gerais de metas por tipo
   */
  export type TotaisGeraisMeta = {
    tipo: 'metaVenda' | 'limiteCompra' | 'metaMargem';
    valorMeta: number;
  };
  
  /**
   * Resposta de metas no dashboard
   */
  export type TypeDashboardMetaHeader = {
    totais_por_empresa: TotaisPorEmpresaMeta[];
    total_geral: TotaisGeraisMeta[];
  };