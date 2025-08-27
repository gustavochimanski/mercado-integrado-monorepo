"use client";

import { useState } from "react";
import { getCliente, setEnderecoPadraoId } from "@cardapio/stores/client/ClientStore";
import { useMutateEndereco } from "@cardapio/services/useQueryEndereco";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function EnderecoModal({ open, onClose, onConfirm }: Props) {
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [erro, setErro] = useState("");

  const cliente = getCliente();

  // ✅ Hooks sempre no topo, mesmo que cliente.telefone seja undefined
  const { create } = useMutateEndereco(cliente.telefone ?? "");

  const handleConfirmar = () => {
    if (rua.trim().length < 2 || numero.trim().length === 0) {
      setErro("Digite rua e número válidos.");
      return;
    }

    create.mutate(
      {
        cliente_telefone: cliente.telefone!, 
        logradouro: rua,
        numero,
        bairro,
        cidade,
        cep,
        estado,
      },
      {
        onSuccess: (data) => {
          setEnderecoPadraoId(data.data.id);
          setErro("");
          onConfirm?.();
          onClose();
        },
        onError: () => setErro("Erro ao salvar endereço. Tente novamente."),
      }
    );
  };

  // ❌ JSX condicional, mas hooks já foram chamados
  if (!cliente.telefone) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cliente não encontrado!</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Endereço de Entrega</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Rua</Label>
            <Input value={rua} onChange={(e) => setRua(e.target.value)} />
          </div>
          <div>
            <Label>Número</Label>
            <Input value={numero} onChange={(e) => setNumero(e.target.value)} />
          </div>
          <div>
            <Label>Bairro</Label>
            <Input value={bairro} onChange={(e) => setBairro(e.target.value)} />
          </div>
          <div>
            <Label>Cidade</Label>
            <Input value={cidade} onChange={(e) => setCidade(e.target.value)} />
          </div>
          <div>
            <Label>CEP</Label>
            <Input value={cep} onChange={(e) => setCep(e.target.value)} inputMode="numeric" />
          </div>
          <div>
            <Label>Estado (UF)</Label>
            <Input
              value={estado}
              onChange={(e) => setEstado(e.target.value.toUpperCase())}
              maxLength={2}
            />
          </div>

          {erro && <p className="text-sm text-red-500 mt-2">{erro}</p>}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleConfirmar}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
