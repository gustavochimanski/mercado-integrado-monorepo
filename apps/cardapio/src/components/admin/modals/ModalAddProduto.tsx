"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Button } from "@cardapio/components/Shared/ui/button";
import { useMutateProduto } from "@cardapio/hooks/useQueryProduto";
import { Label } from "@cardapio/components/Shared/ui/label";

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

  const { mutate, isPending } = useMutateProduto();

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
    formData.append("cod_categoria", String(codCategoria));
    formData.append("subcategoria_id", String(subcategoriaId));
    formData.append("preco_venda", String(form.preco_venda));
    formData.append("custo", String(form.custo));
    if (form.imagem) {
      formData.append("imagem", form.imagem);
    }

    mutate(formData, {
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
            <Input name="cod_barras" value={form.cod_barras} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input name="descricao" value={form.descricao} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="preco_venda">Preço</Label>
            <Input
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
              name="custo"
              type="number"
              value={form.custo}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="imagem">Imagem</Label>
            <Input name="imagem" type="file" accept="image/*" onChange={handleFile} />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Produto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
