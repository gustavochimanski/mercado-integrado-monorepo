"use client";

import { useState } from "react";
import { Button } from "@supervisor/components/ui/button";
import { Input } from "@supervisor/components/ui/input";
import { Etiqueta } from "@supervisor/app/(private)/processos/types/etiquetas/ean13";
import DataTableComponentMui from "@supervisor/components/shared/table/mui-data-table";
import { Card, CardContent, CardHeader } from "@supervisor/components/ui/card";
import { columnsEtqPreco } from "./columns";
import { CirclePlus, Printer } from "lucide-react";
import { useToast } from "@supervisor/hooks/use-toast";

export default function ComponentEtiquetasPreco() {
  const [codigo, setCodigo] = useState("");
  const [contadorId, setContadorId] = useState(1);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [quantidade, setQuantidade] = useState(1); 
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);

  const toast = useToast();

  const isValidCodigo = /^[0-9]{13}$/.test(codigo);
  const isValidQuantidade = quantidade > 0;
  const isValidValor = !isNaN(parseFloat(valor)) && parseFloat(valor) > 0;

  const adicionarEtiqueta = () => {
    if (!isValidCodigo) return toast.toast({ title: "Código EAN-13 inválido!", description: "", open: true });
    if (!descricao.trim()) return toast.toast({ title: "Descrição obrigatória!", open: true });
    if (!isValidValor) return toast.toast({ title: "Valor inválido!", open: true });
    if (!isValidQuantidade) return toast.toast({ title: "Quantidade inválida!", open: true });

    const novaEtiqueta: Etiqueta = {
      id: contadorId,
      codigo,
      descricao,
      valor: parseFloat(valor),
      quantidade,
    };
    
    setContadorId((prev) => prev + 1);
    setEtiquetas((prev) => [...prev, novaEtiqueta]);

    setCodigo("");
    setDescricao("");
    setValor("");
    setQuantidade(1);

    toast.toast({ title: "Etiqueta adicionada!", open: true });
  };

  const removerEtiqueta = (id: number) => {
    setEtiquetas((prev) => prev.filter((etiqueta) => etiqueta.id !== id));
    toast.toast({ title: "Etiqueta removida.", open: true });
  };

  const imprimir = async () => {
    if (etiquetas.length === 0) {
      toast.toast({ title: "Nenhuma etiqueta para imprimir.", open: true });
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/imprimir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(etiquetas),
      });

      const response = await res.json();

      if (!res.ok) {
        const mensagens = response?.error?.split(" | ") || [response?.error || "Erro desconhecido"];
        mensagens.forEach((msg: string) => toast.toast({ title: msg.trim(), open: true }));
        return;
      }

      toast.toast({ title: "Todas as etiquetas foram enviadas com sucesso!", open: true });
      setEtiquetas([]);
    } catch (err: any) {
      console.error("Erro ao imprimir:", err.message);
      toast.toast({ title: "Erro ao conectar com a API.", open: true });
    }
  };

  return (
    <Card className="flex-1 h-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-5 mb-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="codigo" className="block text-sm font-semibold">Código EAN-13</label>
            <Input
              className="h-10"
              id="codigo"
              placeholder="Ex.: 7891234567890"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="descricao" className="block text-sm font-semibold">Descrição do Produto</label>
            <Input
              className="h-10"
              id="descricao"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
          <div className="flex gap-4 justify-center">
            <div className="flex flex-col gap-1">
              <label htmlFor="valor" className="block text-sm font-semibold">Valor</label>
              <Input
                className="w-32 h-10"
                id="valor"
                type="number"
                placeholder="Ex.: 12.99"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="quantidade" className="block text-sm font-semibold">Quant</label>
              <Input
                className="w-20 h-10 text-center"
                id="quantidade"
                type="number"
                min={1}
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-5 mt-auto">
            <Button variant="secondary" onClick={adicionarEtiqueta}>
              <CirclePlus/>Adicionar
            </Button>
            <Button onClick={imprimir}>
              <Printer/>Imprimir
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <DataTableComponentMui rows={etiquetas} columns={columnsEtqPreco(removerEtiqueta)}/>
      </CardContent>
    </Card>
  );
}
