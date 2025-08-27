"use client";

import { useState, useEffect } from "react";
import { setMeioPagamentoId } from "@cardapio/stores/client/ClientStore";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";

interface MeioPagamento {
  id: number;
  nome: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function MeioPagamentoModal({ open, onClose, onConfirm }: Props) {
  const [meios, setMeios] = useState<MeioPagamento[]>([]);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [erro, setErro] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // mockando os meios de pagamento
  useEffect(() => {
    setIsLoading(true);
    const mockMeios: MeioPagamento[] = [
      { id: 1, nome: "Dinheiro" },
      { id: 2, nome: "Cartão de Crédito" },
      { id: 3, nome: "PIX" },
    ];
    // simula atraso de carregamento
    const timer = setTimeout(() => {
      setMeios(mockMeios);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  function handleConfirmar() {
    if (!selecionado) {
      setErro("Selecione uma forma de pagamento.");
      return;
    }
    setMeioPagamentoId(Number(selecionado));
    setErro("");
    onConfirm?.();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Forma de Pagamento</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p>Carregando opções...</p>
        ) : (
          <RadioGroup value={selecionado ?? ""} onValueChange={setSelecionado}>
            {meios.map((m) => (
              <div key={m.id} className="flex items-center space-x-2">
                <RadioGroupItem value={String(m.id)} id={`pg-${m.id}`} />
                <Label htmlFor={`pg-${m.id}`}>{m.nome}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {erro && <p className="text-sm text-red-500 mt-2">{erro}</p>}

        <DialogFooter className="mt-4">
          <Button onClick={handleConfirmar}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
