"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useMutateCliente } from "@cardapio/services/useQueryCliente";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function ClienteIdentificacaoModal({ open, onClose, onConfirm }: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [jaTenhoCadastro, setJaTenhoCadastro] = useState(false);
  const [aguardandoCodigo, setAguardandoCodigo] = useState(false);

  const { create, enviarCodigoNovoDispositivo, confirmarCodigo } = useMutateCliente();

  const handleConfirmar = () => {
    const telefoneLimpo = telefone.replace(/\D/g, "");
    setErro("");

    if (!telefoneLimpo || telefoneLimpo.length < 10) {
      return setErro("Digite um telefone válido (com DDD).");
    }

    if (jaTenhoCadastro && !aguardandoCodigo) {
      enviarCodigoNovoDispositivo.mutate({ telefone: telefoneLimpo }, {
        onSuccess: () => setAguardandoCodigo(true),
        onError: () => setErro("Erro ao enviar código. Tente novamente."),
      });
    } else if (jaTenhoCadastro && aguardandoCodigo) {
      if (codigo.trim().length !== 6) {
        return setErro("Digite o código de 6 dígitos recebido.");
      }
      confirmarCodigo.mutate({ telefone: telefoneLimpo, codigo }, {
        onSuccess: () => {
          onConfirm?.();
          onClose();
        },
        onError: () => setErro("Código inválido ou expirado."),
      });
    } else {
      if (!nome || nome.trim().length < 2) {
        return setErro("Digite um nome válido.");
      }
      create.mutate({ nome, telefone: telefoneLimpo }, {
        onSuccess: () => {
          onConfirm?.();
          onClose();
        },
        onError: () => setErro("Erro ao criar cliente. Tente novamente."),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {jaTenhoCadastro
              ? aguardandoCodigo
                ? "Digite o código"
                : "Autenticação"
              : "Identifique-se"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!jaTenhoCadastro && (
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: João Silva"
              />
            </div>
          )}

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Ex: (11) 91234-5678"
              inputMode="tel"
              disabled={aguardandoCodigo}
            />
          </div>

          {jaTenhoCadastro && aguardandoCodigo && (
            <div>
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="000000"
                inputMode="numeric"
              />
            </div>
          )}

          {erro && <p className="text-sm text-red-500">{erro}</p>}

          {!aguardandoCodigo && (
            <p
              className="text-sm text-blue-500 cursor-pointer hover:underline"
              onClick={() => {
                setJaTenhoCadastro(!jaTenhoCadastro);
                setErro("");
                setNome("");
                setCodigo("");
                setAguardandoCodigo(false);
              }}
            >
              {jaTenhoCadastro ? "Criar novo cadastro" : "Já tenho cadastro"}
            </p>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={handleConfirmar}

          >
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
