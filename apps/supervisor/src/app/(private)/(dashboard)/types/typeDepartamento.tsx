// Tipo de cada linha de departamento
export interface TypeTotaisPorDepartamento {
  departamento: string;
  total_vendas: number;
}

// Estrutura do array “departamento_empresa”
export interface PorEmpresaDepartamentos {
  empresa: string;                              // ex: "Golfinho"
  departamentos: TypeTotaisPorDepartamento[];   // lista interna
}
