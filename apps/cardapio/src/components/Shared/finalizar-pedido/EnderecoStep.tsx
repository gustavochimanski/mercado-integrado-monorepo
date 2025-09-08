"use client";

import { useState, useEffect } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Label } from "@cardapio/components/Shared/ui/label";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@cardapio/components/Shared/ui/dialog";
import { Pen, Trash2, Plus } from "lucide-react";

export default function EnderecoStep({ enderecos, enderecoId, onSelect, onAdd, onUpdate, onDelete }: any) {
  const [selected, setSelected] = useState<number | null>(enderecoId ?? null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [novo, setNovo] = useState({ logradouro: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" });
  const [open, setOpen] = useState(false);

  useEffect(() => setSelected(enderecoId ?? null), [enderecoId]);

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

      <div className="grid gap-3">
        {enderecos.map((e: any) => {
          const isSelected = selected === e.id;
          return (
            <div
              key={e.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setSelected(e.id);
                onSelect(e.id);
              }}
              className={`relative rounded-xl border p-3 sm:p-4 cursor-pointer transition
                ${isSelected ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-muted hover:bg-muted/30"}
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-medium text-sm sm:text-base">
                    {e.logradouro}, {e.numero}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    • {e.bairro} - {e.cidade}/{e.estado}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                      • {e.cep}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      startEdit(e);
                    }}
                  >
                    <Pen className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onDelete(e.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Excluir</span>
                  </Button>
                </div>
              </div>
              {isSelected && (
                <span className="absolute bottom-2 right-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                  Selecionado
                </span>
              )}
            </div>
          );
        })}

        {/* Card para adicionar novo */}
        <div
          role="button"
          tabIndex={0}
          onClick={startAddNew}
          className="w-full rounded-xl border-2 border-dashed border-muted-foreground/60 flex items-center justify-center gap-2 py-4"
        >
          <Plus className="h-5 w-5 text-muted-foreground/60" />
          <span className="text-muted-foreground/60">Adicionar Novo Endereço</span>
        </div>
      </div>

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
