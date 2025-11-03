"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useMutateCliente } from "@cardapio/services/useQueryCliente";
import { useUserContext } from "@cardapio/hooks/auth/userContext";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  forceLoginMode?: boolean; // true = forçar login, false = forçar cadastro, undefined = livre
}

export default function ClienteIdentificacaoModal({ open, onClose, onConfirm, forceLoginMode }: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [jaTenhoCadastro, setJaTenhoCadastro] = useState(forceLoginMode ?? false);

  const { create, loginDireto } = useMutateCliente();
  const { refreshUser } = useUserContext();

  // Reset estado quando modal abrir com modo forçado
  useEffect(() => {
    if (open && forceLoginMode !== undefined) {
      setJaTenhoCadastro(forceLoginMode);
      setNome("");
      setTelefone("");
      setErro("");
    }
  }, [open, forceLoginMode]);

  const handleConfirmar = () => {
    const telefoneLimpo = telefone.replace(/\D/g, "");
    setErro("");

    if (!telefoneLimpo || telefoneLimpo.length < 10) {
      return setErro("Digite um telefone válido (com DDD).");
    }

    if (jaTenhoCadastro) {
      // Login direto apenas com telefone
      loginDireto.mutate({ telefone: telefoneLimpo }, {
        onSuccess: async () => {
          try {
            // Atualiza o contexto do usuário para verificar se é admin
            await refreshUser();
            // Pequeno delay para garantir que o estado foi atualizado
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            console.warn("Erro ao atualizar contexto do usuário:", error);
          }
          onConfirm?.();
          onClose();
        },
        onError: () => setErro("Erro ao fazer login. Verifique se o telefone está correto."),
      });
    } else {
      if (!nome || nome.trim().length < 2) {
        return setErro("Digite um nome válido.");
      }
      create.mutate({ nome, telefone: telefoneLimpo }, {
        onSuccess: async () => {
          try {
            // Atualiza o contexto do usuário para verificar se é admin
            await refreshUser();
            // Pequeno delay para garantir que o estado foi atualizado
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            console.warn("Erro ao atualizar contexto do usuário:", error);
          }
          onConfirm?.();
          onClose();
        },
        onError: () => setErro("Erro ao criar cliente. Tente novamente."),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-xs mx-auto">
        <DialogHeader>
          <DialogTitle>
            {jaTenhoCadastro ? "Autenticação" : "Identifique-se"}
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
            />
          </div>

          {erro && <p className="text-sm text-red-500">{erro}</p>}

          {forceLoginMode === undefined && (
            <p
              className="text-sm text-blue-500 cursor-pointer hover:underline"
              onClick={() => {
                setJaTenhoCadastro(!jaTenhoCadastro);
                setErro("");
                setNome("");
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
