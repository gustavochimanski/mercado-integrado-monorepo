import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select"
import { CreditCard } from "lucide-react"
import { PagamentoTabProps } from "@supervisor/types/pedidos/modal"

// Componente PagamentoTab para gerenciar a aba de pagamento no modal de pedidos
export const PagamentoTab: React.FC<PagamentoTabProps> = ({
  formData,
  setFormData,
  isEditing,
  pedidoCompleto,
  meiosPagamento,
  getMeioPagamentoNome,
  isMeioPagamentoDinheiro,
  handleTrocoChange,
  formatCurrency
}) => {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Dica para Edição de Itens Forma de Pagamento*/}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <CreditCard className="w-5 h-5 text-purple-600" />
            Forma de Pagamento
          </h3>
          <div className="space-y-4">

            {/* Dica para Edição de Itens Meio de Pagamento*/}
            <div className="space-y-2">
              <Label htmlFor="meio_pagamento" className="text-sm font-medium">
                Meio de Pagamento
              </Label>
              {isEditing ? (
                <Select
                  value={formData.meio_pagamento_id?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData((prev: any) => ({ ...prev, meio_pagamento_id: Number.parseInt(value) }))
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Selecione o meio de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {meiosPagamento.map((meio) => (
                      <SelectItem key={meio.id} value={meio.id.toString()}>
                        {meio.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={getMeioPagamentoNome(formData.meio_pagamento_id)} disabled className="bg-white" />
              )}
            </div>

            {/* Dica para Edição de Itens Troco Para*/}
            <div className="space-y-2">
              <Label htmlFor="troco_para" className="text-sm font-medium">
                Troco Para
              </Label>
              <Input
                id="troco_para"
                value={formatCurrency(formData.troco_para)}
                onChange={handleTrocoChange}
                disabled={!isEditing || !isMeioPagamentoDinheiro()}
                className="bg-white"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {/* Dica para Edição de Itens Valores */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Valores</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">

              {/* Dica para Edição de Itens Subtotal */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Subtotal</Label>
                <Input value={formatCurrency(pedidoCompleto?.subtotal || 0)} disabled className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Desconto</Label>
                <Input value={formatCurrency(pedidoCompleto?.desconto || 0)} disabled className="bg-white" />
              </div>
            </div>

            {/* Dica para Edição de Itens Taxa de Entrega e Taxa de Serviço */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Taxa de Entrega</Label>
                <Input value={formatCurrency(pedidoCompleto?.taxa_entrega || 0)} disabled className="bg-white" />
              </div>

              {/* Dica para Edição de Itens Taxa de Serviço */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Taxa de Serviço</Label>
                <Input value={formatCurrency(pedidoCompleto?.taxa_servico || 0)} disabled className="bg-white" />
              </div>
            </div>

            {/* Dica para Edição de Itens Valor Total */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Valor Total</Label>
              <Input
                value={formatCurrency(pedidoCompleto?.valor_total || 0)}
                disabled
                className="bg-white font-semibold text-lg text-green-700"
              />
            </div>
            {pedidoCompleto?.cupom && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Cupom Aplicado</Label>
                <Input value={pedidoCompleto.cupom.codigo} disabled className="bg-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dica para Edição de Itens Transação */}
      {pedidoCompleto?.transacao && (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Transação</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Gateway</Label>
              <Input value={pedidoCompleto.transacao.gateway} disabled className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Método</Label>
              <Input value={pedidoCompleto.transacao.metodo} disabled className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Input value={pedidoCompleto.transacao.status} disabled className="bg-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}