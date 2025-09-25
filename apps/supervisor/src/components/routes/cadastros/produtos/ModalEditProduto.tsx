"use client";

import { Button } from "@supervisor/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Input } from "@supervisor/components/ui/input";
import { Label } from "@supervisor/components/ui/label";
import { useMutateProduto } from "@supervisor/services/useQueryProduto";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produto: any;
  empresaId: number;
}

export const ModalEditarProduto = ({ open, onOpenChange, produto, empresaId }: Props) => {
  const [form, setForm] = useState({
    cod_barras: "",
    descricao: "",
    custo: "" as number | string,
    preco_venda: "" as number | string,
    preco_delivery: "" as number | string,
    categoria: "",
    exibir_delivery: true,
    imagem: undefined as File | undefined,
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, imagem: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!produto?.cod_barras) return;

    // Validação mínima
    if (form.preco_venda === "" || isNaN(Number(form.preco_venda))) return;

    try {
      // ✅ Preparar dados no formato correto (todos os campos do modal)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cod_barras">Código de Barras</Label>
            <Input
              id="cod_barras"
              name="cod_barras"
              value={form.cod_barras}
              onChange={handleChange}
              disabled // Não permite editar código de barras
              required
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="custo">Custo (R$)</Label>
            <Input
              id="custo"
              name="custo"
              type="number"
              step="0.01"
              value={form.custo}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="preco_venda">Preço (R$)</Label>
            <Input
              id="preco_venda"
              name="preco_venda"
              type="number"
              step="0.01"
              value={form.preco_venda}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="preco_delivery">Preço Delivery (R$)</Label>
            <Input
              id="preco_delivery"
              name="preco_delivery"
              type="number"
              step="0.01"
              value={form.preco_delivery}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Input
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="exibir_delivery"
              name="exibir_delivery"
              type="checkbox"
              checked={form.exibir_delivery}
              onChange={(e) => setForm(prev => ({ ...prev, exibir_delivery: e.target.checked }))}
              className="w-4 h-4"
            />
            <Label htmlFor="exibir_delivery">Delivery</Label>
          </div>

          <div>
            <Label htmlFor="imagem">Nova Imagem (Opcional)</Label>
            <Input
              id="imagem"
              name="imagem"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateProductMutate.isPending}
            >
              {updateProductMutate.isPending ? "Atualizando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};