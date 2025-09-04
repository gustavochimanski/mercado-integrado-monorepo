"use client";

import { useState, useEffect } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { RadioGroup, RadioGroupItem } from "@cardapio/components/Shared/ui/radio-group";
import { Label } from "@cardapio/components/Shared/ui/label";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@cardapio/components/Shared/ui/dialog";
import { Pen, Trash2, Plus } from "lucide-react";

export default function EnderecoStep({ enderecos, enderecoId, onSelect, onAdd, onUpdate, onDelete }: any) {
  const [selected, setSelected] = useState(String(enderecoId ?? ""));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [novo, setNovo] = useState({ logradouro: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" });
  const [open, setOpen] = useState(false);

  useEffect(() => setSelected(String(enderecoId ?? "")), [enderecoId]);

  const startEdit = (e: any) => {
    setEditingId(e.id);
    setNovo({ 
      logradouro: e.logradouro, 
      numero: e.numero || "", 
      bairro: e.bairro || "", 
      cidade: e.cidade, 
      estado: e.estado, 
      cep: e.cep 
    });
    setOpen(true);
  };

  const startAddNew = () => {
    setEditingId(null);
    setNovo({ logradouro: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" });
    setOpen(true);
  };

  const handleSave = () => {
    if (editingId !== null) onUpdate({ id: editingId, ...novo });
    else onAdd(novo);

    setEditingId(null);
    setNovo({ logradouro: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Escolha o Endereço</h2>

      <RadioGroup
        value={selected}
        onValueChange={(id) => {
          setSelected(id);
          onSelect(Number(id));
        }}
      >
        {enderecos.map((e: any) => (
          <div
            key={e.id}
            className="flex items-center justify-between rounded-lg border p-2 sm:p-3 hover:bg-muted/30 transition"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value={String(e.id)} id={`end-${e.id}`} />
              <Label htmlFor={`end-${e.id}`} className="cursor-pointer text-sm  flex flex-col">
                <span className="font-medium mr-auto">{e.logradouro}, {e.numero}</span>
                <span className="text-muted-foreground"> – {e.bairro}, {e.cidade}</span>
              </Label>
            </div>
            <div className="flex gap-1 sm:gap-2">
              {/* Ícones apenas no mobile, texto aparece em telas maiores */}
              <Button size="sm" variant="outline" onClick={() => startEdit(e)}>
                <Pen className="h-4 w-4 sm:mr-1" /> 
                <span className="hidden sm:inline">Editar</span>
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(e.id)}>
                <Trash2 className="h-4 w-4 sm:mr-1" /> 
                <span className="hidden sm:inline">Excluir</span>
              </Button>
            </div>
          </div>
        ))}
      </RadioGroup>

      <Button variant="secondary" onClick={startAddNew} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-1" /> 
        <span className="sm:inline">Novo Endereço</span>
      </Button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">{editingId !== null ? "Editar Endereço" : "Novo Endereço"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Rua</Label>
              <Input
                placeholder="Ex: Av. Paulista"
                value={novo.logradouro}
                onChange={(e) => setNovo({ ...novo, logradouro: e.target.value })}
              />
            </div>

            {/* No mobile: 1 coluna, no desktop: 2 colunas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Número</Label>
                <Input
                  placeholder="123"
                  value={novo.numero}
                  onChange={(e) => setNovo({ ...novo, numero: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Bairro</Label>
                <Input
                  placeholder="Centro"
                  value={novo.bairro}
                  onChange={(e) => setNovo({ ...novo, bairro: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Cidade</Label>
                <Input
                  placeholder="São Paulo"
                  value={novo.cidade}
                  onChange={(e) => setNovo({ ...novo, cidade: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Estado</Label>
                <Input
                  placeholder="SP"
                  value={novo.estado}
                  onChange={(e) => setNovo({ ...novo, estado: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>CEP</Label>
              <Input
                placeholder="00000-000"
                value={novo.cep}
                onChange={(e) => setNovo({ ...novo, cep: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button onClick={handleSave} className="w-full sm:w-auto">
              {editingId !== null ? "Salvar" : "Adicionar"}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
