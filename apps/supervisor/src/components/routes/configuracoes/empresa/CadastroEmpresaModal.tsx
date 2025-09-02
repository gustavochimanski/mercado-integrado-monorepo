"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@supervisor/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Label } from "@supervisor/components/ui/label";
import { Button } from "@supervisor/components/ui/button";
import { Select, SelectContent, SelectItem } from "@supervisor/components/ui/select";
import { useUpdateEmpresa, EmpresaForm, useCreateEmpresa } from "@supervisor/services/global/useQueryEmpresasMensura";
import { EmpresaMensura } from "@supervisor/types/empresas/TypeEmpresasMensura";

interface EmpresaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa?: EmpresaMensura | null;
}

export default function EmpresaModal({ open, onOpenChange, empresa }: EmpresaModalProps) {
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<EmpresaForm>({
    defaultValues: {
      nome: "",
      cnpj: "",
      endereco: { logradouro: "", numero: "", bairro: "", cidade: "", cep: "" },
      cardapio_link: "",
      cardapio_tema: "claro",
    },
  });

  const logoFile = watch("logo");
  const createEmpresa = useCreateEmpresa();
  const updateEmpresa = useUpdateEmpresa();

  // Reset form quando a empresa muda
  useEffect(() => {
    if (empresa) {
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
      });
      setLogoPreview(empresa.logo ?? null);
    } else {
      reset();
      setLogoPreview(null);
    }
  }, [empresa, reset]);

  // Preview da logo
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
      if (empresa?.id) {
        await updateEmpresa.mutateAsync({ id: empresa.id, data });
      } else {
        await createEmpresa.mutateAsync(data);
      }
      onOpenChange(false);
      reset();
      setLogoPreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {empresa ? "Editar Empresa" : "Cadastrar Empresa"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex flex-col w-full gap-1">
              <Label htmlFor="nome">Nome da Empresa</Label>
              <Input {...register("nome", { required: true })} placeholder="Ex: Supermercado XYZ" />
              {errors.nome && <span className="text-red-500 text-sm">Nome é obrigatório</span>}
            </div>

            <div className="flex flex-col w-full gap-1">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input {...register("cnpj")} placeholder="00.000.000/0001-00" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="logo">Logo</Label>
            <Input type="file" {...register("logo")} accept="image/*" />
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Preview da logo"
                className="w-32 h-32 object-contain rounded border border-gray-300 mt-2"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cardapio_link">Link do Cardápio</Label>
            <Input {...register("cardapio_link")} placeholder="https://..." />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="cardapio_tema">Tema do Cardápio</Label>
            <Select {...register("cardapio_tema")}>
              <SelectContent>
                <SelectItem value="claro">Claro</SelectItem>
                <SelectItem value="escuro">Escuro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Endereço</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <Label>Logradouro</Label>
                <Input {...register("endereco.logradouro" )} />
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

          <div className="flex ">
            <Button type="submit" disabled={loading} className="bg-green-600 w-full md:w-auto">
              {loading ? "Salvando..." : empresa ? "Salvar Alterações" : "Cadastrar Empresa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
