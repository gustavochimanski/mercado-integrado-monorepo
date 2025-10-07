"use client";

import { useState } from "react";
import { EnderecosList } from "@supervisor/components/routes/pedidos/modal/EnderecosList";
import { useEnderecosCliente, useCreateEnderecoCliente, useUpdateEnderecoCliente } from "@supervisor/services/useQueryEnderecoCliente";
import { EnderecoOut } from "@supervisor/api/models/EnderecoOut";
import dynamic from "next/dynamic";

const EnderecoEditModal = dynamic(
  () => import("@supervisor/components/routes/pedidos/modal/EnderecoEditModal").then(m => ({ default: m.EnderecoEditModal })),
  { ssr: false }
);

interface TabEnderecosClienteProps {
  cliente: any;
  onSaved: () => void;
}

export default function TabEnderecosCliente({ cliente, onSaved }: TabEnderecosClienteProps) {
  const [enderecoEditando, setEnderecoEditando] = useState<EnderecoOut | null>(null);
  const [modalEnderecoOpen, setModalEnderecoOpen] = useState(false);

  const { data: enderecos = [], isLoading, refetch } = useEnderecosCliente(cliente?.id);
  const createEnderecoMutation = useCreateEnderecoCliente();
  const updateEnderecoMutation = useUpdateEnderecoCliente();

  const handleEditEndereco = (endereco: EnderecoOut) => {
    setEnderecoEditando(endereco);
    setModalEnderecoOpen(true);
  };

  const handleAddNewEndereco = () => {
    setEnderecoEditando(null);
    setModalEnderecoOpen(true);
  };

  const handleSaveEndereco = async (endereco: any) => {
    if (!cliente?.id) return;

    try {
      if (enderecoEditando?.id) {
        // Atualizar endereço existente
        await updateEnderecoMutation.mutateAsync({
          clienteId: cliente.id,
          enderecoId: enderecoEditando.id,
          enderecoData: {
            cep: endereco.cep || "",
            logradouro: endereco.logradouro || "",
            numero: endereco.numero || "",
            complemento: endereco.complemento || "",
            bairro: endereco.bairro || "",
            cidade: endereco.cidade || "",
            estado: endereco.estado || "",
            ponto_referencia: endereco.ponto_referencia || "",
            latitude: endereco.latitude,
            longitude: endereco.longitude,
            is_principal: endereco.is_principal || false
          }
        });
      } else {
        // Criar novo endereço
        await createEnderecoMutation.mutateAsync({
          clienteId: cliente.id,
          enderecoData: {
            cep: endereco.cep || "",
            logradouro: endereco.logradouro || "",
            numero: endereco.numero || "",
            complemento: endereco.complemento || "",
            bairro: endereco.bairro || "",
            cidade: endereco.cidade || "",
            estado: endereco.estado || "",
            ponto_referencia: endereco.ponto_referencia || "",
            latitude: endereco.latitude,
            longitude: endereco.longitude,
            is_principal: endereco.is_principal || false
          }
        });
      }

      onSaved();
      setModalEnderecoOpen(false);
      setEnderecoEditando(null);
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
    }
  };

  return (
    <div className="space-y-4 h-full overflow-auto">
      <EnderecosList
        enderecos={enderecos}
        enderecoSelecionado={null}
        onEnderecoSelect={() => {}}
        onEditEndereco={handleEditEndereco}
        onAddNewEndereco={handleAddNewEndereco}
        isEditing={true}
        isLoading={isLoading}
        showSelectionMessage={false}
      />

      <EnderecoEditModal
        open={modalEnderecoOpen}
        onOpenChange={setModalEnderecoOpen}
        clienteId={cliente?.id}
        endereco={enderecoEditando}
        isNewAddress={!enderecoEditando}
        onSave={handleSaveEndereco}
      />
    </div>
  );
}
