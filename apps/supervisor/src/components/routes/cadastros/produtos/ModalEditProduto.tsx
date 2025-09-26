"use client";

import { Button } from "@supervisor/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Input } from "@supervisor/components/ui/input";
import { Label } from "@supervisor/components/ui/label";
import { Switch } from "@supervisor/components/ui/switch";
import { useMutateProduto } from "@supervisor/services/useQueryProduto";
import { useEffect, useState } from "react";
import { Package, DollarSign, Image, Hash, Tag } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produto: any;
  empresaId: number;
}

interface FormData {
  cod_barras: string;
  descricao: string;
  custo: string;
  preco_venda: string;
  preco_delivery: string;
  categoria: string;
  exibir_delivery: boolean;
  imagem: File | undefined;
}

export const ModalEditarProduto = ({ open, onOpenChange, produto, empresaId }: Props) => {
  const [form, setForm] = useState<FormData>({
    cod_barras: "",
    descricao: "",
    custo: "",
    preco_venda: "",
    preco_delivery: "",
    categoria: "",
    exibir_delivery: true,
    imagem: undefined,
  });

  const { update: updateProductMutate } = useMutateProduto();

  // Preencher form com dados do produto quando abrir modal
  useEffect(() => {
    if (produto && open) {
      setForm({
        cod_barras: produto.cod_barras || "",
        descricao: produto.descricao || "",
        custo: produto.custo || "",
        preco_venda: produto.preco_venda || "",
        preco_delivery: produto.preco_delivery || "",
        categoria: produto.label_categoria || "",
        exibir_delivery: produto.exibir_delivery || true,
        imagem: undefined,
      });
    }
  }, [produto, open]);

  // Limpar form quando fechar modal
  useEffect(() => {
    if (!open) {
      setForm({
        cod_barras: "",
        descricao: "",
        custo: "",
        preco_venda: "",
        preco_delivery: "",
        categoria: "",
        exibir_delivery: true,
        imagem: undefined,
      });
    }
  }, [open]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!produto?.cod_barras) return;

    // Validação mínima
    if (!form.descricao.trim() || !form.preco_venda) return;

    try {
      // Preparar dados no formato correto
      await updateProductMutate.mutateAsync({
        cod_barras: form.cod_barras.trim(),
        descricao: form.descricao.trim(),
        cod_empresa: empresaId,
        custo: form.custo && !isNaN(Number(form.custo)) ? Number(form.custo) : undefined,
        preco_venda: Number(form.preco_venda),
        preco_delivery: form.preco_delivery && !isNaN(Number(form.preco_delivery)) ? Number(form.preco_delivery) : undefined,
        categoria: form.categoria.trim(),
        exibir_delivery: form.exibir_delivery,
        imagem: form.imagem,
      });

      onOpenChange(false); // Fechar modal após sucesso
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  // Validação básica
  const isFormValid = form.descricao.trim() && form.preco_venda;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">            
            Editar Produto
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Código de Barras */}
          <div className="space-y-2">
            <Label htmlFor="cod_barras" className="flex items-center gap-2">
              <Hash size={16} />
              Código de Barras
            </Label>
            <Input
              id="cod_barras"
              name="cod_barras"
              value={form.cod_barras}
              onChange={handleChange}
              disabled // Não permite editar código de barras
              className="bg-gray-50"
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

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="categoria" className="flex items-center gap-2">
              <Tag size={16} />
              Categoria
            </Label>
            <Input
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              placeholder="Digite a categoria"
            />
          </div>

          {/* Imagem */}
          <div className="space-y-2">
            <Label htmlFor="imagem" className="flex items-center gap-2">
              <Image size={16} />
              Nova Imagem (opcional)
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
              disabled={!isFormValid || updateProductMutate.isPending}
              className="flex-1"
            >
              {updateProductMutate.isPending ? "Atualizando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
