"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@supervisor/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Label } from "@supervisor/components/ui/label";
import { Button } from "@supervisor/components/ui/button";
import { Switch } from "@supervisor/components/ui/switch";
import { useUpdateEmpresa, EmpresaForm } from "@supervisor/services/useQueryEmpresasMensura";
import { EmpresaMensura } from "@supervisor/types/empresas/TypeEmpresasMensura";
import { CardapioTemaSelect } from "./CardapioTema";

interface EditEmpresaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa: EmpresaMensura;
  onSuccess?: () => void;
}

export default function EditEmpresaModal({ open, onOpenChange, empresa, onSuccess }: EditEmpresaModalProps) {
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(empresa.logo ?? null);

  const { register, handleSubmit, reset, watch, control, formState: { errors } } = useForm<EmpresaForm>({
    defaultValues: {
      nome: empresa.nome,
      cnpj: empresa.cnpj ?? "",
      endereco: {
        logradouro: empresa.endereco?.logradouro ?? "",
        numero: empresa.endereco?.numero ?? "",
        bairro: empresa.endereco?.bairro ?? "",
        cidade: empresa.endereco?.cidade ?? "",
        cep: empresa.endereco?.cep ?? "",
      },
      cardapio_link: empresa.cardapio_link ?? "",
      cardapio_tema: empresa.cardapio_tema ?? "claro",
      aceita_pedido_automatico: empresa.aceita_pedido_automatico ?? false,
    },
  });

  const logoFile = watch("logo");
  const updateEmpresa = useUpdateEmpresa();

  // Reset form se empresa mudar
  useEffect(() => {
    reset({
      nome: empresa.nome,
      cnpj: empresa.cnpj ?? "",
      endereco: {
        logradouro: empresa.endereco?.logradouro ?? "",
        numero: empresa.endereco?.numero ?? "",
        bairro: empresa.endereco?.bairro ?? "",
        cidade: empresa.endereco?.cidade ?? "",
        cep: empresa.endereco?.cep ?? "",
      },
      cardapio_link: empresa.cardapio_link ?? "",
      cardapio_tema: empresa.cardapio_tema ?? "claro",
      aceita_pedido_automatico: empresa.aceita_pedido_automatico ?? false,
    });
    setLogoPreview(empresa.logo ?? null);
  }, [empresa, reset]);

  // Preview de logo
  useEffect(() => {
    if (logoFile && logoFile.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(logoFile[0]);
    }
  }, [logoFile]);

  const onSubmit = async (data: EmpresaForm) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        endereco: {
          logradouro: data.endereco?.logradouro ?? "",
          numero: data.endereco?.numero ?? "",
          bairro: data.endereco?.bairro ?? "",
          cidade: data.endereco?.cidade ?? "",
          cep: data.endereco?.cep ?? "",
        },
      };

      await updateEmpresa.mutateAsync({ id: empresa.id, data: payload });
      onOpenChange(false);
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
          <DialogTitle className="text-2xl font-bold">Editar Empresa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex flex-col w-full gap-1">
              <Label>Nome da Empresa</Label>
              <Input {...register("nome", { required: true })} />
              {errors.nome && <span className="text-red-500 text-sm">Nome é obrigatório</span>}
            </div>
            <div className="flex flex-col w-full gap-1">
              <Label>CNPJ</Label>
              <Input {...register("cnpj")} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Logo</Label>
            <Input type="file" {...register("logo")} accept="image/*" />
            {logoPreview && <img src={logoPreview} alt="Preview da logo" className="w-32 h-32 object-contain rounded border border-gray-300 mt-2" />}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Link do Cardápio</Label>
            <Input {...register("cardapio_link")} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tema do Cardápio</Label>
            <CardapioTemaSelect control={control} name="cardapio_tema" />
          </div>

          <div className="flex items-center gap-2">
            <Controller
              name="aceita_pedido_automatico"
              control={control}
              render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label>Aceita pedido automático</Label>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Endereço</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label>Logradouro</Label>
                <Input {...register("endereco.logradouro")} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Número</Label>
                <Input {...register("endereco.numero")} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <Label>Bairro</Label>
                <Input {...register("endereco.bairro")} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Cidade</Label>
                <Input {...register("endereco.cidade")} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>CEP</Label>
                <Input {...register("endereco.cep")} />
              </div>
            </div>
          </div>

          <div className="flex">
            <Button type="submit" disabled={loading} className="bg-green-600 w-full md:w-auto">
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
