export interface Entregador {
  id: number
  nome: string
  telefone: string
  documento: string
  veiculo_tipo: string
  placa: string
  acrescimo_taxa: number
  created_at: string
  updated_at: string
  empresas: Array<{
    id: number
    nome: string
  }>
}
