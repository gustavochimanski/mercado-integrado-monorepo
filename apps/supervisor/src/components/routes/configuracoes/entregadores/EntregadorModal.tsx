"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@supervisor/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Label } from "@supervisor/components/ui/label";
import { Button } from "@supervisor/components/ui/button";
import { Switch } from "@supervisor/components/ui/switch";
import { useMutateEntregador, Entregador } from "@supervisor/services/useQueryEntregadores";
import { useEmpresas } from "@supervisor/services/useQueryEmpresasMensura";

interface EntregadorForm {
  nome: string;
  telefone?: string;
  documento?: string;
  veiculo_tipo?: string;
  placa?: string;
  acrescimo_taxa?: number;
}

interface EntregadorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entregador?: Entregador & { empresas?: { id: number; nome: string }[] } | null;
}

export default function EntregadorModal({ open, onOpenChange, entregador }: EntregadorModalProps) {
  const [loading, setLoading] = useState(false);
  const { create, update, vincularEmpresa, desvincularEmpresa } = useMutateEntregador();
  const { data: empresas } = useEmpresas();

  const [empresasSelecionadas, setEmpresasSelecionadas] = useState<number[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EntregadorForm>({
    defaultValues: {
      nome: "",
      telefone: "",
      documento: "",
      veiculo_tipo: "",
      placa: "",
      acrescimo_taxa: 0,
    },
  });

  // Reset do form e empresasSelecionadas quando mudam
  useEffect(() => {
    if (entregador) {
      reset({
        nome: entregador.nome,
        telefone: entregador.telefone || "",
        documento: entregador.documento || "",
        veiculo_tipo: entregador.veiculo_tipo || "",
        placa: entregador.placa || "",
        acrescimo_taxa: entregador.acrescimo_taxa || 0,
      });
      setEmpresasSelecionadas(entregador.empresas?.map((e) => e.id) ?? []);
    } else {
      reset();
      setEmpresasSelecionadas([]);
    }
  }, [entregador, reset]);

  const handleToggleEmpresa = (empresaId: number) => {
    setEmpresasSelecionadas((prev) =>
      prev.includes(empresaId) ? prev.filter((id) => id !== empresaId) : [...prev, empresaId]
    );
  };

  const onSubmit = async (data: EntregadorForm) => {
    setLoading(true);
    try {
      if (entregador?.id) {
        // Atualiza entregador
        await update.mutateAsync({ id: entregador.id, ...data });

        // Sincroniza empresas
        const empresasParaVincular = empresasSelecionadas.filter(
          (id) => !entregador.empresas?.some((e) => e.id === id)
        );
        const empresasParaDesvincular = entregador.empresas
          ?.map((e) => e.id)
          .filter((id) => !empresasSelecionadas.includes(id)) ?? [];

        await Promise.all([
          ...empresasParaVincular.map((id) =>
            vincularEmpresa.mutateAsync({ entregador_id: entregador.id, empresa_id: id })
          ),
          ...empresasParaDesvincular.map((id) =>
            desvincularEmpresa.mutateAsync({ entregador_id: entregador.id, empresa_id: id })
          ),
        ]);
      } else {
        // Criação
        await create.mutateAsync({ ...data, ativo: true, empresa_id: empresasSelecionadas[0] || 0 });
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
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {entregador ? "Editar Entregador" : "Cadastrar Entregador"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Dados do entregador */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-full">
              <Label>Nome</Label>
              <Input {...register("nome", { required: true })} placeholder="Ex: João Silva" />
              {errors.nome && <span className="text-red-500 text-sm">Nome é obrigatório</span>}
            </div>

            <div className="flex flex-col gap-1 w-full">
              <Label>Telefone</Label>
              <Input {...register("telefone")} placeholder="(99) 99999-9999" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-full">
              <Label>Documento (CPF/CNPJ)</Label>
              <Input {...register("documento")} placeholder="CPF ou CNPJ" />
            </div>

            <div className="flex flex-col gap-1 w-full">
              <Label>Veículo</Label>
              <Input {...register("veiculo_tipo")} placeholder="Moto, carro, bike" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex flex-col gap-1 w-full">
              <Label>Placa</Label>
              <Input {...register("placa")} placeholder="ABC-1234" />
            </div>

            <div className="flex flex-col gap-1 w-40">
              <Label>Acréscimo Taxa</Label>
              <Input type="number" {...register("acrescimo_taxa", { valueAsNumber: true })} placeholder="0.0" />
            </div>
          </div>

          {/* Empresas */}
          {empresas && (
            <div className="mt-4">
              <Label>Empresas vinculadas</Label>
              <div className="flex flex-col gap-2 mt-2">
                {empresas.map((e) => (
                  <div key={e.id} className="flex items-center justify-between">
                    <span>{e.nome}</span>
                        <Switch
                        checked={empresasSelecionadas.includes(e.id)}
                        onCheckedChange={(checked: boolean) => {
                            setEmpresasSelecionadas((prev) =>
                            checked
                                ? [...prev, e.id]       // marcar
                                : prev.filter((id) => id !== e.id) // desmarcar
                            )
                        }}
                        />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading} className="bg-green-600 w-full md:w-auto">
              {loading ? "Salvando..." : entregador ? "Salvar Alterações" : "Cadastrar Entregador"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
