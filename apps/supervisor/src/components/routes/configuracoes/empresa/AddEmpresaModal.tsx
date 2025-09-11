"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Label } from "@supervisor/components/ui/label";
import { Input } from "@supervisor/components/ui/input";
import { Button } from "@supervisor/components/ui/button";
import { Switch } from "@supervisor/components/ui/switch";
import { CardapioTemaSelect } from "./CardapioTema";
import { useCreateEmpresa, EmpresaForm } from "@supervisor/services/useQueryEmpresasMensura";

interface AddEmpresaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddEmpresaModal({ open, onOpenChange, onSuccess }: AddEmpresaModalProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, control, watch } = useForm<EmpresaForm>({
    defaultValues: {
      nome: "",
      cnpj: "",
      endereco: { logradouro: "", numero: "", bairro: "", cidade: "", cep: "" },
      cardapio_link: "",
      cardapio_tema: "claro",
      aceita_pedido_automatico: false,
    },
  });

  const logoFile = watch("logo");
  const createEmpresa = useCreateEmpresa();

  const onSubmit = async (data: EmpresaForm) => {
    setLoading(true);
    try {
      await createEmpresa.mutateAsync(data);
      onOpenChange(false);
      reset();
      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Cadastrar Empresa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label>Nome</Label>
            <Input {...register("nome", { required: true })} />

            <Label>CNPJ</Label>
            <Input {...register("cnpj")} />

            <Label>Cardápio Link</Label>
            <Input {...register("cardapio_link")} />

            <Label>Tema do Cardápio</Label>
            <CardapioTemaSelect control={control} name="cardapio_tema" />
            
            <div className="flex items-center gap-2">
              <Controller
                name="aceita_pedido_automatico"
                control={control}
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
              <Label>Aceita pedido automático</Label>
            </div>
            
            {/* 🆕 Tempo de entrega máximo */}
            <Label>Tempo máximo de entrega (minutos)</Label>
            <Input
              type="number"
              min={0}
              {...register("tempo_entrega_maximo")}
              placeholder="Ex: 60"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="bg-green-600 w-full md:w-auto"
          >
            {loading ? "Salvando..." : "Cadastrar Empresa"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
