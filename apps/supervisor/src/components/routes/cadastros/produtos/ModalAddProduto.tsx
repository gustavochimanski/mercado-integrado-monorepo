"use client";

import { Button } from "@supervisor/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Input } from "@supervisor/components/ui/input";
import { Label } from "@supervisor/components/ui/label";
import { Switch } from "@supervisor/components/ui/switch";
import { useMutateProduto } from "@supervisor/services/useQueryProduto";
import { useEffect, useState } from "react";
import { Package, DollarSign, Image, Hash } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
}

interface FormData {
  cod_barras: string;
  descricao: string;
  preco_venda: string;
  custo: string;
  preco_delivery: string;
  exibir_delivery: boolean;
  imagem: File | undefined;
}

export const ModalNovoProduto = ({ open, onOpenChange, empresaId }: Props) => {
  const [form, setForm] = useState<FormData>({
    cod_barras: "",
    descricao: "",
    preco_venda: "",
    custo: "",
    preco_delivery: "",
    exibir_delivery: true,
    imagem: undefined,
  });

  const { create: createProductMutate } = useMutateProduto();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, exibir_delivery: checked }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, imagem: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação mínima
    if (!form.cod_barras.trim() || !form.descricao.trim() || !form.preco_venda) return;

    // Envia o objeto tipado que o hook espera
    createProductMutate.mutate(
      {
        cod_barras: form.cod_barras.trim(),
        descricao: form.descricao.trim(),
        cod_empresa: empresaId,
        preco_venda: Number(form.preco_venda),
        custo: form.custo === "" ? undefined : Number(form.custo),
        imagem: form.imagem,
      }
    );
  };

  const resetForm = () => {
    setForm({
      cod_barras: "",
      descricao: "",
      preco_venda: "",
      custo: "",
      preco_delivery: "",
      exibir_delivery: true,
      imagem: undefined,
    });
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  // Validação básica
  const isFormValid = form.cod_barras.trim() && form.descricao.trim() && form.preco_venda;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">            
            Novo Produto
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Código de Barras */}
          <div className="space-y-2">
            <Label htmlFor="cod_barras" className="flex items-center gap-2">
              <Hash size={16} />
              Código de Barras *
            </Label>
            <Input
              id="cod_barras"
              name="cod_barras"
              value={form.cod_barras}
              onChange={handleChange}
              placeholder="Digite o código de barras"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao" className="flex items-center gap-2">
              <Package size={16} />
              Descrição *
            </Label>
            <Input
              id="descricao"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Digite a descrição do produto"
              required
            />
          </div>

          {/* Preço de Venda */}
          <div className="space-y-2">
            <Label htmlFor="preco_venda" className="flex items-center gap-2">
              <DollarSign size={16} />
              Preço de Venda *
            </Label>
            <Input
              id="preco_venda"
              name="preco_venda"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={form.preco_venda}
              onChange={handleChange}
              placeholder="0,00"
              required
            />
          </div>

          {/* Preço de Custo */}
          <div className="space-y-2">
            <Label htmlFor="custo" className="flex items-center gap-2">
              <DollarSign size={16} />
              Custo (opcional)
            </Label>
            <Input
              id="custo"
              name="custo"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={form.custo}
              onChange={handleChange}
              placeholder="0,00"
            />
          </div>

          {/* Preço Delivery */}
          <div className="space-y-2">
            <Label htmlFor="preco_delivery" className="flex items-center gap-2">
              <DollarSign size={16} />
              Preço Delivery (opcional)
            </Label>
            <Input
              id="preco_delivery"
              name="preco_delivery"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={form.preco_delivery}
              onChange={handleChange}
              placeholder="0,00"
            />
          </div>

          {/* Imagem */}
          <div className="space-y-2">
            <Label htmlFor="imagem" className="flex items-center gap-2">
              <Image size={16} />
              Imagem
            </Label>
            <Input
              id="imagem"
              name="imagem"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
          </div>

          {/* Exibir no Delivery */}
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="exibir_delivery" className="flex items-center gap-2">
              Exibir no Delivery
            </Label>
            <Switch
              id="exibir_delivery"
              checked={form.exibir_delivery}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || createProductMutate.isPending}
              className="flex-1"
            >
              {createProductMutate.isPending ? "Salvando..." : "Salvar Produto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
