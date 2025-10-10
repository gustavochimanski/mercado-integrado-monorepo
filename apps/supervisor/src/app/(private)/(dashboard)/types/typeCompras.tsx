/**
 * Totais de compras por empresa (agrupado por status)
 */
export type TypeTotalCompraEmpresaResponse = {
    empresa: string
    valorTotal: number
  };
  
  /**
   * Resultado completo de compras no período
   */
  export type TypeComprasGeralResponse = {
    por_empresa: TypeTotalCompraEmpresaResponse[];
    total_geral: number
  };
  