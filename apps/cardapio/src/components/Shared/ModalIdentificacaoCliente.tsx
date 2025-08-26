"use client";

import { useState } from "react";
import { setTelefoneCliente } from "@cardapio/stores/client/PhoneStore";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useMutateCliente } from "@cardapio/services/useQueryCliente";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function ClienteIdentificacaoModal({ open, onClose, onConfirm }: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");

  const { create } = useMutateCliente(); // hook para criar cliente

  function handleConfirmar() {
    const telefoneLimpo = telefone.replace(/\D/g, "");

    if (nome.trim().length < 2) {
      return setErro("Digite um nome válido.");
    }

    if (telefoneLimpo.length < 10) {
      return setErro("Digite um telefone válido (com DDD).");
    }

    // 🔥 Cria cliente na API
    create.mutate(
      { nome, telefone: telefoneLimpo }, // 👈 email fake só se for obrigatório
      {
        onSuccess: (cliente: any) => {
          // guarda nome e telefone (store)
          setTelefoneCliente(telefoneLimpo);

          setErro("");
          onConfirm?.();
          onClose();
        },
        onError: () => {
          setErro("Erro ao criar cliente. Tente novamente.");
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Identifique-se</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva"
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Ex: (11) 91234-5678"
              inputMode="tel"
            />
          </div>

          {erro && <p className="text-sm text-red-500">{erro}</p>}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleConfirmar} disabled={create.isPending}>
            {create.isPending ? "Salvando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
