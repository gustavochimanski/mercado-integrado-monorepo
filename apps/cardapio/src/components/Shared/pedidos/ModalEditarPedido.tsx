"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pedido } from "@cardapio/types/pedido";
import { useMutatePedido } from "@cardapio/services/useQueryPedido";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@cardapio/components/Shared/ui/dialog";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Textarea } from "@cardapio/components/Shared/ui/textarea";
import { Label } from "@cardapio/components/Shared/ui/label";
import { Loader2 } from "lucide-react";

// Schema de validação baseado na API
const editarPedidoSchema = z.object({
  observacao_geral: z.string().optional(),
});

type EditarPedidoData = z.infer<typeof editarPedidoSchema>;

interface Props {
  pedido: Pedido | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalEditarPedido({ pedido, isOpen, onClose }: Props) {
  const { toggleModoEdicao, updatePedido } = useMutatePedido();
  const [isLoading, setIsLoading] = useState(false);
  const [modoEdicaoAtivo, setModoEdicaoAtivo] = useState(false);
  const modoEdicaoJaAtivado = useRef(false);

  const form = useForm<EditarPedidoData>({
    resolver: zodResolver(editarPedidoSchema),
    defaultValues: {
      observacao_geral: "",
    },
  });

  const { register, handleSubmit, setValue } = form;

  // Carrega dados do pedido e gerencia modo edição
  useEffect(() => {
    if (pedido && isOpen) {
      setValue("observacao_geral", pedido.observacao_geral || "");

      // Ativa modo edição apenas uma vez por abertura do modal
      if (!modoEdicaoJaAtivado.current && !modoEdicaoAtivo) {
        modoEdicaoJaAtivado.current = true;
        setIsLoading(true);
        toggleModoEdicao.mutate(
          { id: pedido.id, modo: true },
          {
            onSuccess: () => {
              setModoEdicaoAtivo(true);
              setIsLoading(false);
            },
            onError: () => {
              setIsLoading(false);
              onClose();
            },
          }
        );
      }
    } else if (!isOpen) {
      // Reset do estado quando modal fecha
      setModoEdicaoAtivo(false);
      modoEdicaoJaAtivado.current = false;
    }
  }, [pedido, isOpen, setValue, modoEdicaoAtivo, toggleModoEdicao, onClose]);

  const handleClose = async () => {
    if (pedido && modoEdicaoAtivo) {
      setIsLoading(true);
      toggleModoEdicao.mutate(
        { id: pedido.id, modo: false },
        {
          onSuccess: () => {
            setModoEdicaoAtivo(false);
            setIsLoading(false);
            onClose();
          },
          onError: () => {
            setModoEdicaoAtivo(false);
            setIsLoading(false);
            onClose();
          },
        }
      );
    } else {
      setModoEdicaoAtivo(false);
      onClose();
    }
  };

  const onSubmit = async (data: EditarPedidoData) => {
    if (!pedido) return;

    setIsLoading(true);

    // Primeiro salva as alterações
    updatePedido.mutate(
      {
        id: pedido.id,
        data: {
          observacao_geral: data.observacao_geral,
        },
      },
      {
        onSuccess: () => {
          // Depois desativa modo edição
          toggleModoEdicao.mutate(
            { id: pedido.id, modo: false },
            {
              onSuccess: () => {
                setModoEdicaoAtivo(false);
                setIsLoading(false);
                onClose();
              },
              onError: () => {
                setIsLoading(false);
                onClose();
              },
            }
          );
        },
        onError: () => {
          setIsLoading(false);
        },
      }
    );
  };


  if (!pedido) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Editar Pedido #{pedido.id}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin mr-2" />
            Processando...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {/* Observação Geral */}
              <div>
                <Label htmlFor="observacao_geral">Observação Geral</Label>
                <Textarea
                  id="observacao_geral"
                  {...register("observacao_geral")}
                  placeholder="Observações sobre o pedido..."
                  className="mt-1"
                />
              </div>


              {/* Informações do Pedido (somente leitura) */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Pedido:</span>
                    <span>#{pedido.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Cliente:</span>
                    <span>{pedido.cliente_nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-green-600">
                      R$ {pedido.valor_total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Itens:</span>
                    <span>{pedido.itens.length} itens</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}