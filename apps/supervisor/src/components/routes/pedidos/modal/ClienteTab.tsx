import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { Button } from "../../../ui/button"
import { User, MapPin, Edit } from "lucide-react"
import { ClienteTabProps } from "@supervisor/types/pedidos/modal"
import { EnderecoEditModal } from "./EnderecoEditModal"
import { useState } from "react"


// Componente funcional ClienteTab
export const ClienteTab: React.FC<ClienteTabProps> = ({
  formData,
  setFormData,
  isEditing,
  pedidoCompleto,
  getEnderecoCompleto,
  onEnderecoUpdate,
  isUpdatingEndereco = false
}) => {
  const [enderecoEditModalOpen, setEnderecoEditModalOpen] = useState(false)

  // Função para abrir modal de edição de endereço
  const handleEditEndereco = () => {
    setEnderecoEditModalOpen(true)
  }

  // Função para salvar endereço
  const handleSaveEndereco = (endereco: any) => {
    if (onEnderecoUpdate) {
      onEnderecoUpdate(endereco)
    }
    setEnderecoEditModalOpen(false)
  }

  // Renderiza o componente
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">

          {/* Seção de Informações do Cliente */}
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            <User className="w-5 h-5 text-blue-600" />
            Informações do Cliente
          </h3>
          <div className="space-y-4">

            {/* Campo Nome Cliente*/}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nome</Label>
              <Input
                value={formData.nome_cliente}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, nome_cliente: e.target.value }))}
                disabled={!isEditing}
                className="bg-white"
              />
            </div>

            {/* Campo CPF Cliente*/}
            <div className="space-y-2">
              <Label className="text-sm font-medium">CPF</Label>
              <Input
                value={formData.cpf_cliente}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, cpf_cliente: e.target.value }))}
                disabled={!isEditing}
                className="bg-white"
              />
            </div>

            {/* Campo Telefone Cliente*/}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Telefone</Label>
              <Input
                value={formData.telefone_cliente}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, telefone_cliente: e.target.value }))}
                disabled={!isEditing}
                className="bg-white"
              />
            </div>

            {/* Campo Email Cliente*/}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email</Label>
              <Input
                value={formData.email_cliente}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, email_cliente: e.target.value }))}
                disabled={!isEditing}
                className="bg-white"
              />
            </div>

            {/* Campo Data de Nascimento Cliente*/}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data de Nascimento</Label>
              <Input
                type="date"
                value={formData.data_nascimento_cliente}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, data_nascimento_cliente: e.target.value }))}
                disabled={!isEditing}
                className="bg-white"
              />
            </div>
          </div>
        </div>


        {/* Seção de Endereço de Entrega */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <MapPin className="w-5 h-5 text-green-600" />
              Endereço de Entrega
            </h3>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEditEndereco}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar Endereço
              </Button>
            )}
          </div>
          <div className="space-y-4">

            {/* Campo Endereço Completo */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Endereço Completo</Label>
              <div className="bg-white border rounded-lg p-3">
                <p className="text-sm">{getEnderecoCompleto()}</p>
              </div>
            </div>
            {pedidoCompleto?.endereco?.ponto_referencia && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ponto de Referência</Label>
                <Input value={pedidoCompleto.endereco.ponto_referencia} disabled className="bg-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edição de Endereço */}
      <EnderecoEditModal
        open={enderecoEditModalOpen}
        onOpenChange={setEnderecoEditModalOpen}
        endereco={pedidoCompleto?.endereco || null}
        onSave={handleSaveEndereco}
        isSaving={isUpdatingEndereco}
      />
    </div>
  )
}