import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Edit, Save, X, Plus } from "lucide-react"
import { ItensTabProps } from "@supervisor/types/pedidos/modal"
import { AdicionarItemModal } from "./AdicionarItemModal"
import { useState } from "react"
import Image from "next/image"


// Componente funcional ItensTab
export const ItensTab: React.FC<ItensTabProps> = ({
  pedidoCompleto,
  itensEditados,
  isEditingItens,
  isSavingItens,
  canEdit,
  handleEditarItens,
  handleCancelarEdicaoItens,
  handleSalvarItens,
  handleQuantidadeChange,
  handleObservacaoChange,
  handleRemoverItem,
  handleAdicionarItem,
  formatCurrency
}) => {
  const [isModalAdicionarOpen, setIsModalAdicionarOpen] = useState(false)
  return (
    <div className="space-y-6 mt-6">
      <div className="bg-gray-50 rounded-lg p-6">

        {/* Cabeçalho com Título e Botões de Ação */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Itens do Pedido</h3>
          {canEdit() && !isEditingItens && (
            <div className="flex gap-4">
              <Button variant="outline" size="sm" onClick={handleEditarItens}>
                <Edit className="w-4 h-4 mr-2" />
                Editar Itens
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setIsModalAdicionarOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
          )}

          {/* Botões de Cancelar, Adicionar e Salvar */}
          {isEditingItens && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelarEdicaoItens}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSalvarItens} disabled={isSavingItens}>
                <Save className="w-4 h-4 mr-2" />
                {isSavingItens ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          )}
        </div>

        {/* Lista de Itens Editados */}
        {itensEditados && itensEditados.length > 0 ? (
          <div className="space-y-3">
            {itensEditados
              .filter(item => item.action !== "remove")
              .map((item) => {
                const originalIndex = itensEditados.findIndex(i =>
                  i.id ? i.id === item.id : i.produto_cod_barras === item.produto_cod_barras
                )
                return (
                  <div key={item.id || item.produto_cod_barras} className="bg-white rounded-lg p-4 border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 flex gap-3">
                        {/* Imagem do produto */}
                        <div className="relative w-12 h-12 flex-shrink-0">
                          {item.produto_imagem_snapshot ? (
                            <Image
                              src={item.produto_imagem_snapshot}
                              alt={item.produto_descricao_snapshot}
                              fill
                              className="object-cover rounded"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                              <span className="text-gray-400 text-xl">📦</span>
                            </div>
                          )}
                        </div>

                        {/* Informações do produto */}
                        <div className="flex-1">
                          <h4 className="font-medium">{item.produto_descricao_snapshot}</h4>
                          <p className="text-sm text-muted-foreground">Código: {item.produto_cod_barras}</p>

                          {/* Campo de Observação do Item */}
                          {isEditingItens ? (
                            <div className="mt-3 space-y-2">
                              <div className="space-y-1">
                                <Label className="text-xs font-medium">Observação</Label>
                                <Input
                                  value={item.observacao}
                                  onChange={(e) => handleObservacaoChange(originalIndex, e.target.value)}
                                  placeholder="Observação do item..."
                                  className="text-sm"
                                />
                              </div>
                            </div>
                          ) : (
                            item.observacao && <p className="text-sm text-muted-foreground mt-1">{item.observacao}</p>
                          )}
                        </div>
                      </div>

                      {/* Campo de Quantidade e Preço do Item */}
                      <div className="text-right ml-4 space-y-2">
                        {isEditingItens ? (
                          <div className="space-y-2">

                            {/* Campo de Quantidade e Preço do Item */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantidadeChange(originalIndex, item.quantidade - 1)}
                                disabled={item.quantidade <= 1}
                                className="h-8 w-8 p-0"
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                value={item.quantidade}
                                onChange={(e) => handleQuantidadeChange(originalIndex, Number(e.target.value))}
                                className="w-16 text-center text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                min={1}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantidadeChange(originalIndex, item.quantidade + 1)}
                                className="h-8 w-8 p-0"
                              >
                                +
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(item.preco_unitario)} cada
                            </p>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoverItem(originalIndex)}
                              className="w-full text-xs"
                            >
                              <X className="w-3 h-3 mr-1" />
                              Remover
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold">
                              {item.quantidade}x {formatCurrency(item.preco_unitario)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total: {formatCurrency(item.quantidade * item.preco_unitario)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum item encontrado</p>
        )}

        {/* Dica para Edição de Itens */}
        {isEditingItens && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Dica:</strong> Você pode alterar quantidades e observações dos itens.
              Para remover um item, clique no botão &quot;Remover&quot;.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Adicionar Item */}
      <AdicionarItemModal
        isOpen={isModalAdicionarOpen}
        onClose={() => setIsModalAdicionarOpen(false)}
        onAdicionarItem={(produto) => {
          handleAdicionarItem(produto)
          setIsModalAdicionarOpen(false)
        }}
        empresaId={pedidoCompleto?.empresa?.id || 0}
      />
    </div>
  )
}