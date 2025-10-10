import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { Button } from "../../../ui/button"
import { Truck, User, Phone, Car, ExternalLink } from "lucide-react"
import { EntregaTabProps } from "@supervisor/types/pedidos/modal"
import { useEntregadores } from "@supervisor/services/useQueryEntregadores"

// Componente funcional React
export const EntregaTab: React.FC<EntregaTabProps> = ({
  formData,
  setFormData,
  isEditing,
  pedidoCompleto,
  formatDateTime
}) => {
  const { data: entregadores = [], isLoading: loadingEntregadores } = useEntregadores(true)

  const entregadorAtual = pedidoCompleto?.entregador
  const entregadoresDisponiveis = entregadores.filter(e => e.empresas && e.empresas.length > 0)

  // Renderiza o componente
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">

          {/* Seção de Informações de Entrega */ }
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Truck className="w-5 h-5 text-indigo-600" />
            Informações de Entrega
          </h3>
          <div className="space-y-4">

            {/* Endereço de Entrega */}
            {pedidoCompleto?.endereco?.endereco_selecionado ? (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">             
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-2">Endereço de Entrega</h4>

                    {/* Endereço formatado */}
                    <p className="text-sm text-gray-700 mb-2">
                      {[
                        pedidoCompleto.endereco.endereco_selecionado.logradouro,
                        pedidoCompleto.endereco.endereco_selecionado.numero,
                        pedidoCompleto.endereco.endereco_selecionado.bairro,
                        pedidoCompleto.endereco.endereco_selecionado.cidade,
                        pedidoCompleto.endereco.endereco_selecionado.estado
                      ].filter(Boolean).join(", ")}
                    </p>

                    {/* CEP */}
                    {pedidoCompleto.endereco.endereco_selecionado.cep && (
                      <p className="text-xs text-gray-500 mb-2">
                        CEP: {pedidoCompleto.endereco.endereco_selecionado.cep}
                      </p>
                    )}

                    {/* Complemento */}
                    {pedidoCompleto.endereco.endereco_selecionado.complemento && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Complemento:</span> {pedidoCompleto.endereco.endereco_selecionado.complemento}
                      </p>
                    )}

                    {/* Ponto de referência */}
                    {pedidoCompleto.endereco.endereco_selecionado.ponto_referencia && (
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Referência:</span> {pedidoCompleto.endereco.endereco_selecionado.ponto_referencia}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-dashed border-gray-300 text-center">
                <div className="bg-gray-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                  <Truck className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Nenhum endereço de entrega definido</p>
                <p className="text-xs text-gray-400 mt-1">
                  Configure o endereço na aba Cliente
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Seção de Informações do Entregador */ }
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <User className="w-5 h-5 text-indigo-600" />
            Entregador Vinculado
          </h3>

          {isEditing ? (
            <div className="space-y-4">
              {/* Seletor de Entregador */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selecionar Entregador</Label>
                <Select
                  value={formData.entregador_id ? formData.entregador_id.toString() : "none"}
                  onValueChange={(value) => setFormData((prev: any) => ({
                    ...prev,
                    entregador_id: value === "none" ? null : Number(value)
                  }))}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Selecione um entregador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum entregador</SelectItem>
                    {loadingEntregadores ? (
                      <SelectItem value="loading" disabled>
                        Carregando entregadores...
                      </SelectItem>
                    ) : (
                      entregadoresDisponiveis.map((entregador: any) => (
                          <SelectItem key={entregador.id} value={entregador.id.toString()}>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{entregador.nome}</span>
                              {entregador.telefone && (
                                <span className="text-muted-foreground">- {entregador.telefone}</span>
                              )}
                            </div>
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            // Modo visualização
            entregadorAtual ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-indigo-100 rounded-full p-2">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{entregadorAtual.nome}</h4>
                      <p className="text-sm text-gray-500">Entregador Ativo</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Telefone */}
                    {entregadorAtual.telefone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {entregadorAtual.telefone}
                        </span>
                      </div>
                    )}

                    {/* Veículo */}
                    {(entregadorAtual.veiculo_tipo || entregadorAtual.placa) && (
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {entregadorAtual.veiculo_tipo}
                          {entregadorAtual.placa && `- ${entregadorAtual.placa}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-dashed border-gray-300 text-center">
                <div className="bg-gray-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-2">Nenhum entregador vinculado ao pedido</p>
                {entregadoresDisponiveis.length > 0 ? (
                  <p className="text-xs text-gray-400">
                    Use o modo de edição para vincular um dos {entregadoresDisponiveis.length} entregador(es) disponível(is)
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">
                    Nenhum entregador disponível para vincular
                  </p>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Seção de Observações */ }
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Observações</h3>

        {/* Campo de Texto para Observações Gerais */ }
        <div className="space-y-2">
          <Label htmlFor="observacao_geral" className="text-sm font-medium">
            Observações Gerais
          </Label>
          <textarea
            id="observacao_geral"
            value={formData.observacao_geral || ""}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, observacao_geral: e.target.value }))}
            disabled={!isEditing}
            rows={4}
            placeholder="Observações do pedido..."
            className="flex min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  )
}