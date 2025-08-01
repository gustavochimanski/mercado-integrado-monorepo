// mocks/mockComparativoTemporal.ts

export interface ComparativoEmpresa {
  empresa: string;
  valorAtual: number;
  valorAnterior: number;
}

export const mockComparativoTemporal: ComparativoEmpresa[] = [
  { empresa: "Supermercado A", valorAtual: 10500, valorAnterior: 9800 },
  { empresa: "Supermercado B", valorAtual: 7200, valorAnterior: 7500 },
  { empresa: "Supermercado C", valorAtual: 8600, valorAnterior: 8600 },
  { empresa: "Supermercado D", valorAtual: 4300, valorAnterior: 3900 },
];
