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
import { useMutateProduto } from "@cardapio/hooks/useQueryProduto";


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
  codCategoria: number;
  subcategoriaId: number;
}

export const ModalNovoProduto = ({
  open,
  onOpenChange,
  empresaId,
  codCategoria,
  subcategoriaId,
}: Props) => {
  const [form, setForm] = useState({
    cod_barras: "",
    descricao: "",
    preco_venda: 0,
    custo: 0,
    imagem: undefined as File | undefined,
  });

  // Importa o create/update/remove já configurado para apiAdmin
  const { create: createProduct } = useMutateProduto();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, imagem: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("cod_barras", form.cod_barras);
    formData.append("descricao", form.descricao);
    formData.append("cod_empresa", String(empresaId));
    formData.append("cod_categoria", String(codCategoria));
    formData.append("subcategoria_id", String(subcategoriaId));
    formData.append("preco_venda", String(form.preco_venda));
    formData.append("custo", String(form.custo));
    if (form.imagem) formData.append("imagem", form.imagem);

    createProduct.mutate({ cod_empresa: empresaId, formData }, {
      onSuccess: () => {
        onOpenChange(false);
        setForm({
          cod_barras: "",
          descricao: "",
          preco_venda: 0,
          custo: 0,
          imagem: undefined,
        });
      },
    });
  };

  useEffect(() => {
    if (!open) {
      setForm({
        cod_barras: "",
        descricao: "",
        preco_venda: 0,
        custo: 0,
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
