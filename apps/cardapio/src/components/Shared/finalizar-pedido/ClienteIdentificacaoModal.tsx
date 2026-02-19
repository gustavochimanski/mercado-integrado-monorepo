"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { isClienteJaCadastradoError, useMutateCliente } from "@cardapio/services/cliente";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";

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
  // 'phone' = somente telefone (primeiro passo). 'askName' = pede nome para criar cadastro.
  const [step, setStep] = useState<"phone" | "askName">(forceLoginMode === false ? "askName" : "phone");

  const { create, loginDireto } = useMutateCliente();
  const { refreshUser } = useUserContext();

  // Reset estado quando modal abrir com modo forçado
  useEffect(() => {
    if (open) {
      // Ajustar passo inicial conforme `forceLoginMode` quando o modal abre
      if (forceLoginMode !== undefined) {
        setStep(forceLoginMode === false ? "askName" : "phone");
      } else {
        setStep("phone");
      }
      setNome("");
      setTelefone("");
      setErro("");
    }
  }, [open, forceLoginMode]);

  const concluirLoginComSucesso = async () => {
    try {
      // Atualiza o contexto do usuário para verificar se é admin
      await refreshUser();
      // Pequeno delay para garantir que o estado foi atualizado
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.warn("Erro ao atualizar contexto do usuário:", error);
    }
    onConfirm?.();
    onClose();
  };

  function isClienteNaoEncontradoError(error: unknown) {
    const status = (error as any)?.response?.status;
    if (status === 404) return true;
    const msg = extractErrorMessage(error, "").toLowerCase();
    return /não encontr|not found|não existe|not cadastrad|no existe/.test(msg);
  }

  const handleConfirmar = () => {
    const telefoneLimpo = telefone.replace(/\D/g, "");
    setErro("");

    if (!telefoneLimpo || telefoneLimpo.length < 10) {
      return setErro("Digite um telefone válido (com DDD).");
    }

    if (step === "phone") {
      // Tenta login direto apenas com telefone
      loginDireto.mutate(
        { telefone: telefoneLimpo },
        {
          onSuccess: concluirLoginComSucesso,
          onError: (error) => {
            // Se for "cliente não encontrado" e não estamos forçando login, avançamos para pedir nome
            if (!forceLoginMode && isClienteNaoEncontradoError(error)) {
              setStep("askName");
              setErro("");
              return;
            }
            setErro("Erro ao fazer login. Verifique se o telefone está correto.");
          },
        }
      );
      return;
    }

    // step === "askName" => cria cliente
    if (!nome || nome.trim().length < 2) {
      return setErro("Digite um nome válido.");
    }
    create.mutate(
      { nome, telefone: telefoneLimpo },
      {
        onSuccess: concluirLoginComSucesso,
        onError: (error) => {
          // Se o cliente já existir, faz login automaticamente com o telefone informado
          if (isClienteJaCadastradoError(error)) {
            loginDireto.mutate(
              { telefone: telefoneLimpo },
              {
                onSuccess: concluirLoginComSucesso,
                onError: () =>
                  setErro("Esse telefone já tem cadastro, mas não foi possível fazer login. Tente novamente."),
              }
            );
            return;
          }

          setErro(extractErrorMessage(error, "Erro ao criar cliente. Tente novamente."));
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-xs mx-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "phone" ? "Autenticação" : "Identifique-se"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === "askName" && (
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João Silva" />
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

          {step === "askName" && forceLoginMode !== true && (
            <p
              className="text-sm text-blue-500 cursor-pointer hover:underline"
              onClick={() => {
                setStep("phone");
                setErro("");
              }}
            >
              Voltar
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
