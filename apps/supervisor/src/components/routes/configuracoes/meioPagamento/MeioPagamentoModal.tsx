"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@supervisor/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Label } from "@supervisor/components/ui/label";
import { Button } from "@supervisor/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { MeioPagamento, useMutateMeioPagamento } from "@supervisor/services/useQueryMeioPagamento";

interface MeioPagamentoForm {
  nome: string;
  tipo: MeioPagamento["tipo"];
  ativo: boolean;
}

interface MeioPagamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meioPagamento?: MeioPagamento | null;
}

export default function MeioPagamentoModal({ open, onOpenChange, meioPagamento }: MeioPagamentoModalProps) {
  const [loading, setLoading] = useState(false);
  const { create, update } = useMutateMeioPagamento();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<MeioPagamentoForm>({
    defaultValues: {
      nome: "",
      tipo: "DINHEIRO",
      ativo: true,
    },
  });

  // Reset do form quando mudar o meioPagamento
  useEffect(() => {
    if (meioPagamento) {
      reset({
        nome: meioPagamento.nome,
        tipo: meioPagamento.tipo,
        ativo: meioPagamento.ativo,
      });
    } else {
      reset();
    }
  }, [meioPagamento, reset]);

  const onSubmit = async (data: MeioPagamentoForm) => {
    setLoading(true);
    try {
      if (meioPagamento?.id) {
        await update.mutateAsync({ id: meioPagamento.id, ...data });
      } else {
        await create.mutateAsync(data);
      }
      onOpenChange(false);
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {meioPagamento ? "Editar Meio de Pagamento" : "Cadastrar Meio de Pagamento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label>Nome</Label>
            <Input {...register("nome", { required: true })} placeholder="Ex: PIX" />
            {errors.nome && <span className="text-red-500 text-sm">Nome é obrigatório</span>}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Tipo</Label>
              <Controller
                control={control}
                name="tipo"
                render={({ field }) => (
                  <Select
                    value={field.value}                  // valor atual do form
                    onValueChange={field.onChange}       // atualiza RHF
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CARTAO_ENTREGA">Cartão na entrega</SelectItem>
                      <SelectItem value="PIX_ENTREGA">PIX na entrega</SelectItem>
                      <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                      <SelectItem value="CARTAO_ONLINE">Cartão online</SelectItem>
                      <SelectItem value="PIX_ONLINE">PIX online</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" {...register("ativo")} defaultChecked />
            <Label>Ativo</Label>
          </div>

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading} className="bg-green-600 w-full md:w-auto">
              {loading ? "Salvando..." : meioPagamento ? "Salvar Alterações" : "Cadastrar Meio de Pagamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
