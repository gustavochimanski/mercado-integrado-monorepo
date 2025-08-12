// src/components/modals/ModalNovoProduto.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Label } from "@cardapio/components/Shared/ui/label";
import { useMutateProduto } from "@cardapio/services/useQueryProduto";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
  codCategoria: number;
  vitrineId: number;
}

export const ModalNovoProduto = ({
  open,
  onOpenChange,
  empresaId,
  codCategoria,
  vitrineId,
}: Props) => {
  // guarde números como string para evitar NaN enquanto digita
  const [form, setForm] = useState({
    cod_barras: "",
    descricao: "",
    preco_venda: "", // string
    custo: "",       // string
    imagem: undefined as File | undefined,
  });

  const { create: createProduct } = useMutateProduto();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? prev[name as keyof typeof prev] : value,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({ ...prev, imagem: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.cod_barras.trim() || !form.descricao.trim() || !form.preco_venda.trim()) return;

    createProduct.mutate(
      {
        cod_empresa: empresaId,
        cod_barras: form.cod_barras.trim(),
        descricao: form.descricao.trim(),
        cod_categoria: codCategoria,
        vitrine_id: vitrineId,
        preco_venda: form.preco_venda, // o hook converte para string decimal corretamente
        custo: form.custo === "" ? undefined : form.custo,
        imagem: form.imagem ?? null,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setForm({
            cod_barras: "",
            descricao: "",
            preco_venda: "",
            custo: "",
            imagem: undefined,
          });
        },
      }
    );
  };

  useEffect(() => {
    if (!open) {
      setForm({
        cod_barras: "",
        descricao: "",
        preco_venda: "",
        custo: "",
        imagem: undefined,
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="cod_barras">Código de barras</Label>
            <Input
              id="cod_barras"
              name="cod_barras"
              value={form.cod_barras}
              onChange={handleChange}
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
            <Label htmlFor="preco_venda">Preço</Label>
            <Input
              id="preco_venda"
              name="preco_venda"
              type="number"
              inputMode="decimal"
              step="0.01"
              value={form.preco_venda}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="custo">Custo</Label>
            <Input
              id="custo"
              name="custo"
              type="number"
              inputMode="decimal"
              step="0.00001"
              value={form.custo}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="imagem">Imagem</Label>
            <Input
              id="imagem"
              name="imagem"
              type="file"
              accept="image/*"
              onChange={handleFile}
            />
          </div>

          <Button type="submit" disabled={createProduct.isPending}>
            {createProduct.isPending ? "Salvando..." : "Salvar Produto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
