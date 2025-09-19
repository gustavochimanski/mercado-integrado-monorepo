"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@supervisor/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Label } from "@supervisor/components/ui/label";
import { Button } from "@supervisor/components/ui/button";
import { useMutateRegiaoEntrega } from "@supervisor/services/useQueryRegioesEntrega";
import EnderecoSearchInput from "@supervisor/components/shared/endereco/EnderecoSearchInput";
import type { RegiaoEntregaCreate, RegiaoEntregaUpdate } from "@supervisor/api";
import { RegiaoEntregaForm, RegiaoEntregaModalProps } from "@supervisor/types/configuraçoes/regiaoEntrega";

// Componente de modal para criar/editar região de entrega
export default function RegiaoEntregaModal({
  open,
  onOpenChange,
  regiaoEntrega,
  empresaId
}: RegiaoEntregaModalProps) {
  const [loading, setLoading] = useState(false);
  const { create, update } = useMutateRegiaoEntrega();

  // Hook do react-hook-form
  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<RegiaoEntregaForm>({
    defaultValues: {
      cep: "",
      bairro: "",
      cidade: "",
      uf: "",
      taxa_entrega: 0,
      raio_km: 0,
      ativo: true,
    },
  });  

  // Reset do form quando mudar a regiaoEntrega
  useEffect(() => {
    if (regiaoEntrega) {
      reset({
        cep: regiaoEntrega.cep || "",
        bairro: regiaoEntrega.bairro,
        cidade: regiaoEntrega.cidade,
        uf: regiaoEntrega.uf,
        taxa_entrega: parseFloat(regiaoEntrega.taxa_entrega) || 0,
        raio_km: parseFloat(regiaoEntrega.raio_km || "0") || 0,
        ativo: regiaoEntrega.ativo ?? true,
      });
    } else {
      reset({
        cep: "",
        bairro: "",
        cidade: "",
        uf: "",
        taxa_entrega: 0,
        raio_km: 0,
        ativo: true,
      });
    }
  }, [regiaoEntrega, reset]);

  // Função de submit do form
  const onSubmit = async (data: RegiaoEntregaForm) => {
    setLoading(true);
    try {
      if (regiaoEntrega?.id) {
        const updateData: RegiaoEntregaUpdate = {
          cep: data.cep || null,
          bairro: data.bairro,
          cidade: data.cidade,
          uf: data.uf,
          taxa_entrega: data.taxa_entrega,
          raio_km: data.raio_km || null,
          ativo: data.ativo,
        };
        await update.mutateAsync({ id: regiaoEntrega.id, data: updateData });
      } else {
        const createData: RegiaoEntregaCreate = {
          cep: data.cep || null,
          bairro: data.bairro,
          cidade: data.cidade,
          uf: data.uf,
          taxa_entrega: data.taxa_entrega,
          raio_km: data.raio_km || null,
          ativo: data.ativo,
          empresa_id: empresaId,
        };
        await create.mutateAsync(createData);
      }
      onOpenChange(false);
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Render do componente modal
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {regiaoEntrega ? "Editar Região de Entrega" : "Cadastrar Região de Entrega"}
          </DialogTitle>
        </DialogHeader>

        {/* Formulário para criação/edição de região de entrega */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo de busca inteligente de endereço */}
          <div className="col-span-full">
            <EnderecoSearchInput
              label="Buscar Endereço"
              placeholder="Digite CEP ou Endereço"
              onEnderecoSelected={(endereco) => {
                setValue("cep", endereco.cep || "");
                setValue("bairro", endereco.bairro);
                setValue("cidade", endereco.cidade);
                setValue("uf", endereco.uf);
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CEP (readonly, preenchido automaticamente) */}
            <div className="flex flex-col gap-1">
              <Label>CEP</Label>
              <Input
                {...register("cep")}
                placeholder="Preenchido automaticamente"
                readOnly
                className="bg-gray-50 text-gray-600"
              />
            </div>

            {/* Campos de UF */}
            <div className="flex flex-col gap-1">
              <Label>UF *</Label>
              <Input
                {...register("uf", { required: true, maxLength: 2 })}
                placeholder="Preenchido automaticamente"
                readOnly
                className="bg-gray-50 text-gray-600"
                maxLength={2}
              />
              {errors.uf && <span className="text-red-500 text-sm">UF é obrigatório</span>}
            </div>

            {/* Campos de Cidade */}
            <div className="flex flex-col gap-1">
              <Label>Cidade *</Label>
              <Input
                {...register("cidade", { required: true })}
                placeholder="Preenchida automaticamente"
                readOnly
                className="bg-gray-50 text-gray-600"
              />
              {errors.cidade && <span className="text-red-500 text-sm">Cidade é obrigatória</span>}
            </div>

            {/* Campos de Bairro */}
            <div className="flex flex-col gap-1">
              <Label>Bairro *</Label>
              <Input
                {...register("bairro", { required: true })}
                placeholder="Preenchido automaticamente"
                readOnly
                className="bg-gray-50 text-gray-600"
              />
              {errors.bairro && <span className="text-red-500 text-sm">Bairro é obrigatório</span>}
            </div>

            {/* Campos de taxa de entrega */}
            <div className="flex flex-col gap-1">
              <Label>Taxa de Entrega (R$) *</Label>
              <Input
                type="number"
                step="0.01"
                {...register("taxa_entrega", { required: true, min: 0 })}
                placeholder="Ex: 5.00"
              />
              {errors.taxa_entrega && <span className="text-red-500 text-sm">Taxa de entrega é obrigatória</span>}
            </div>

            {/* Campos de raio de cobertura */}
            <div className="flex flex-col gap-1">
              <Label>Raio de cobertura (km)</Label>
              <Input
                type="number"
                step="0.1"
                {...register("raio_km", { min: 0 })}
                placeholder="Ex: 5.0"
              />
            </div>
          </div>

          {/* Toggle switch de ativo/inativo */}
          <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col">
              <Label className="font-medium">Status da Região</Label>
              <span className="text-sm text-gray-600">Ativar ou desativar esta região de entrega</span>
            </div>
            <Controller
              control={control}
              name="ativo"
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    field.value ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                      field.value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              )}
            />
          </div>

          {/* Botão de submit */}
          <div className="flex justify-end mt-6">
            <Button type="submit" disabled={loading} className="bg-green-600 w-full md:w-auto">
              {loading ? "Salvando..." : regiaoEntrega ? "Salvar Alterações" : "Cadastrar Região de Entrega"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}