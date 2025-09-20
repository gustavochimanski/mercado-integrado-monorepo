import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Truck } from "lucide-react"
import { EntregaTabProps } from "@supervisor/types/pedidos/modal"

// Componente funcional React
export const EntregaTab: React.FC<EntregaTabProps> = ({
  formData,
  setFormData,
  isEditing,
  pedidoCompleto,
  formatDateTime
}) => {

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

            {/* Campo Data de Entrega */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de Entrega</Label>
              <Input value={pedidoCompleto?.tipo_entrega || ""} disabled className="bg-white" />
            </div>
          </div>
        </div>

        {/* Seção de Informações do Entregador */ }
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Entregador</h3>
          {pedidoCompleto?.entregador ? (
            <div className="space-y-4">

              {/* Campo Nome do Entregador */ }
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nome</Label>
                <Input value={pedidoCompleto.entregador.nome} disabled className="bg-white" />
              </div>

              {/* Campo Telefone do Entregador */ }
              <div className="space-y-2">
                <Label className="text-sm font-medium">Telefone</Label>
                <Input value={pedidoCompleto.entregador.telefone} disabled className="bg-white" />
              </div>

              {/* Campo Veículo do Entregador */ }
              <div className="space-y-2">
                <Label className="text-sm font-medium">Veículo</Label>
                <Input value={`${pedidoCompleto.entregador.veiculo_tipo} - ${pedidoCompleto.entregador.placa}`} disabled className="bg-white" />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum entregador vinculado</p>
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