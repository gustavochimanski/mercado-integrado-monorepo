// @supervisor/types/empresas/TypeEmpresas.ts
export type EnderecoResponse = {
  id: number;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  aceita_pedido_automatico: boolean
};

export type EmpresaMensura = {
  id: number;            // pode vir como string em alguns backends – vamos coerir ao usar
  nome: string;
  cnpj?: string | null;
  slug: string;
  logo?: string | null;
  endereco?: EnderecoResponse | null;
  cardapio_link?: string | null
  cardapio_tema?: string | null
  aceita_pedido_automatico: boolean

};
