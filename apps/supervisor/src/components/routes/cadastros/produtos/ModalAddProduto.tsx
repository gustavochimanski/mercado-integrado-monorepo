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
  empresaId: number;
}

export const ModalNovoProduto = ({ open, onOpenChange, empresaId }: Props) => {
  const [form, setForm] = useState({
    cod_barras: "",
    descricao: "",
    preco_venda: "" as number | string, // deixa string para evitar NaN quando vazio
    custo: "" as number | string,       // opcional
    imagem: undefined as File | undefined,
  });

  const { create: createProductMutate } = useMutateProduto();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "number" ? value : value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, imagem: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validação mínima do preço
    if (form.preco_venda === "" || isNaN(Number(form.preco_venda))) return;

    // ✅ Envia o objeto tipado que o hook espera (nada de FormData aqui)
    createProductMutate.mutate(
      {
        cod_barras: String(form.cod_barras).trim(),
        descricao: String(form.descricao).trim(),
        cod_empresa: empresaId,
        preco_venda: Number(form.preco_venda),
        custo: form.custo === "" ? undefined : Number(form.custo),
        imagem: form.imagem,
        // data_cadastro: "2025-08-14" // se quiser enviar
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
            <Label htmlFor="custo">Custo (opcional)</Label>
            <Input
              id="custo"
              name="custo"
              type="number"
              inputMode="decimal"
              step="0.01"
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

          <Button type="submit" disabled={createProductMutate.isPending}>
            {createProductMutate.isPending ? "Salvando..." : "Salvar Produto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
