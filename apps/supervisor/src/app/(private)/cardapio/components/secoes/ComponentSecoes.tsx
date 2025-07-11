"use client";

import { useState } from "react";
import { Button } from "@supervisor/components/ui/button";
import { Input } from "@supervisor/components/ui/input";
import { Label } from "@supervisor/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { useCreateSubcategoria, useSubcategorias } from "../../hooks/useSecoes";
import { useCategorias } from "../../hooks/useCategorias";
import { SecaoDelivery } from "../../types/subCategSecoesType";


interface Props {
  empresaId: number;
}

export default function ComponentSecoes({ empresaId }: Props) {
  
  const [form, setForm] = useState({
    cod_categoria: 0,
    titulo: "",
    ordem: 0,
  });
  
  const { data: secoes } = useSubcategorias(empresaId, form.cod_categoria);
  const { data: categorias, isLoading: loadingCategorias } = useCategorias();
  const createSub = useCreateSubcategoria();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: name === "ordem" ? Number(value) : value,
      };

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      ...form,
      cod_empresa: empresaId,
    };

    try {
      await createSub.mutateAsync(body);
      setForm({
        cod_categoria: 0,
        titulo: "",
        ordem: 0,
      });
    } catch (err) {
      console.error("Erro ao criar seção:", err);
    }
  };

  if (loadingCategorias) return <p>Carregando seções...</p>;

  return (
    <div className="p-4 border rounded bg-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Gerenciar Seções</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="cod_categoria">Categoria</Label>
          <Select
            value={form.cod_categoria.toString()}
            onValueChange={(value) =>
              setForm(() => ({
                cod_categoria: Number(value),
                titulo: "",
                ordem: 0,
              }))
            }
          >

            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="ordem">Ordem</Label>
          <Input
            type="number"
            id="ordem"
            name="ordem"
            value={form.ordem}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit">
          Criar Seção
        </Button>
      </form>

      <hr className="my-6" />

      <div>
        <h3 className="text-lg font-semibold mb-2">Seções Atuais:</h3>
        <ul className="list-disc list-inside">
          {secoes?.map((sec: SecaoDelivery) => (
            <li key={sec.id}>
              {sec.titulo} — <code>{sec.slug}</code> (ordem {sec.ordem})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
