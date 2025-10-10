export type TypeVendaPorHoraResponse = {
  empresa: string;
  vendasPorHora: {
    hora: number;
    total_cupons: number;
    total_vendas: number;
    ticket_medio: number;
  }[];
};
