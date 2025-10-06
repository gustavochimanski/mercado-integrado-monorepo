"use client";

import { useState } from "react";
import { EnderecosList } from "@supervisor/components/routes/pedidos/modal/EnderecosList";
import { useEnderecosCliente } from "@supervisor/services/useQueryEnderecoCliente";
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

  const handleEditEndereco = (endereco: EnderecoOut) => {
    setEnderecoEditando(endereco);
    setModalEnderecoOpen(true);
  };

  const handleAddNewEndereco = () => {
    setEnderecoEditando(null);
    setModalEnderecoOpen(true);
  };

  const handleEnderecoSaved = () => {
    refetch();
    onSaved();
    setModalEnderecoOpen(false);
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
        onEnderecoSaved={handleEnderecoSaved}
      />
    </div>
  );
}
