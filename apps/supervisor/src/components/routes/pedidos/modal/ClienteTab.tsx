import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { User, MapPin } from "lucide-react"
import { ClienteTabProps } from "@supervisor/types/pedidos/modal"
import { EnderecoEditModal } from "./EnderecoEditModal"
import { EnderecosList } from "./EnderecosList"
import { ConfirmarTrocaEnderecoModal } from "./ConfirmarTrocaEnderecoModal"
import { BirthDatePicker } from "../../../shared/BirthDatePicker"
import { useState } from "react"
import { useEnderecosCliente, useUpdateEnderecoEntrega } from "@supervisor/services/useQueryEnderecoCliente"
import type { EnderecoOut } from "@supervisor/api/models/EnderecoOut"
import type { Endereco } from "@supervisor/types/pedido"


// Componente funcional ClienteTab
export const ClienteTab: React.FC<ClienteTabProps> = ({
  formData,
  setFormData,
  isEditing,
  pedidoCompleto,
  onEnderecoUpdate,
  isUpdatingEndereco = false
}) => {
  const [enderecoEditModalOpen, setEnderecoEditModalOpen] = useState(false)
  const [enderecoParaEdicao, setEnderecoParaEdicao] = useState<Endereco | null>(null)
  const [isNovoEndereco, setIsNovoEndereco] = useState(false)
  const [confirmarTrocaModalOpen, setConfirmarTrocaModalOpen] = useState(false)
  const [enderecoParaTroca, setEnderecoParaTroca] = useState<EnderecoOut | null>(null)

  // Hook para buscar endereços do cliente
  const clienteId = pedidoCompleto?.cliente?.id
  const { data: enderecosCliente = [], isLoading: isLoadingEnderecos } = useEnderecosCliente(clienteId)

  // Hook para atualizar endereço de entrega
  const updateEnderecoEntrega = useUpdateEnderecoEntrega()

  // Função para formatar endereço para exibição
  const formatarEnderecoCompleto = (endereco: EnderecoOut): string => {
    const partes = [
      endereco.logradouro,
      endereco.numero,
      endereco.bairro,
      endereco.cidade,
      endereco.estado
    ].filter(Boolean);
    return partes.join(", ");
  };

  // Função para abrir modal de confirmação de troca
  const handleEnderecoSelect = (endereco: EnderecoOut) => {
    // Verificar se está realmente trocando de endereço
    if (endereco.id === pedidoCompleto?.endereco?.id) {
      return; // Mesmo endereço, não fazer nada
    }

    setEnderecoParaTroca(endereco);
    setConfirmarTrocaModalOpen(true);
  }

  // Função para confirmar troca de endereço
  const handleConfirmarTrocaEndereco = () => {
    if (pedidoCompleto?.id && enderecoParaTroca?.id) {
      updateEnderecoEntrega.mutate({
        pedidoId: pedidoCompleto.id,
        enderecoId: enderecoParaTroca.id,
        pedidoCompleto: pedidoCompleto
      });
      setEnderecoParaTroca(null);
    }
  }

  // Função para converter EnderecoOut para Endereco
  const convertEnderecoOutToEndereco = (enderecoOut: EnderecoOut): Endereco => {
    return {
      id: enderecoOut.id,
      cep: enderecoOut.cep || undefined,
      logradouro: enderecoOut.logradouro || undefined,
      numero: enderecoOut.numero || undefined,
      complemento: enderecoOut.complemento || undefined,
      bairro: enderecoOut.bairro || undefined,
      cidade: enderecoOut.cidade || undefined,
      estado: enderecoOut.estado || undefined,
      ponto_referencia: enderecoOut.ponto_referencia || undefined,
      latitude: enderecoOut.latitude || undefined,
      longitude: enderecoOut.longitude || undefined,
      is_principal: enderecoOut.is_principal || false,
      endereco_formatado: undefined,
      rua: enderecoOut.logradouro || undefined,
      codigo_estado: enderecoOut.estado || undefined,
      distrito: enderecoOut.bairro || undefined,
      pais: "Brasil"
    };
  };

  // Função para abrir modal de edição de endereço
  const handleEditEndereco = (endereco?: EnderecoOut) => {
    if (endereco) {
      setEnderecoParaEdicao(convertEnderecoOutToEndereco(endereco));
    } else {
      setEnderecoParaEdicao(null);
    }
    setIsNovoEndereco(!endereco)
    setEnderecoEditModalOpen(true)
  }

  // Função para adicionar novo endereço
  const handleAddNewEndereco = () => {
    handleEditEndereco()
  }

  // Função para salvar endereço
  const handleSaveEndereco = (endereco: any) => {
    if (onEnderecoUpdate) {
      onEnderecoUpdate(endereco)
    }
    setEnderecoEditModalOpen(false)
    setEnderecoParaEdicao(null)
    setIsNovoEndereco(false)
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

            {/* Campo Nome Cliente */}
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
              <BirthDatePicker
                value={formData.data_nascimento_cliente}
                onChange={(dateString) => setFormData((prev: any) => ({ ...prev, data_nascimento_cliente: dateString }))}
                disabled={!isEditing}
                placeholder="Selecione a data de nascimento"
              />
            </div>
          </div>
        </div>


        {/* Seção de Endereços de Entrega */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <MapPin className="w-5 h-5 text-green-600" />
              Endereços de Entrega
            </h3>
          </div>

          {/* Lista de Endereços */}
          <EnderecosList
            enderecos={enderecosCliente}
            enderecoSelecionado={enderecosCliente.find(end => end.id === pedidoCompleto?.endereco?.id) || null}
            onEnderecoSelect={handleEnderecoSelect}
            onEditEndereco={handleEditEndereco}
            onAddNewEndereco={handleAddNewEndereco}
            isEditing={isEditing}
            isLoading={isLoadingEnderecos}
          />
        </div>
      </div>

      {/* Modal de Edição de Endereço */}
      <EnderecoEditModal
        open={enderecoEditModalOpen}
        onOpenChange={setEnderecoEditModalOpen}
        endereco={enderecoParaEdicao}
        onSave={handleSaveEndereco}
        isSaving={isUpdatingEndereco}
        isNewAddress={isNovoEndereco}
        clienteId={clienteId}
      />

      {/* Modal de Confirmação de Troca de Endereço */}
      <ConfirmarTrocaEnderecoModal
        isOpen={confirmarTrocaModalOpen}
        onClose={() => {
          setConfirmarTrocaModalOpen(false);
          setEnderecoParaTroca(null);
        }}
        onConfirm={handleConfirmarTrocaEndereco}
        enderecoAtual={pedidoCompleto?.endereco ? formatarEnderecoCompleto(pedidoCompleto.endereco) : undefined}
        enderecoNovo={enderecoParaTroca ? formatarEnderecoCompleto(enderecoParaTroca) : undefined}
      />
    </div>
  )
}