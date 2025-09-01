"use client";

import { useState, useEffect } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { RadioGroup, RadioGroupItem } from "@cardapio/components/Shared/ui/radio-group";
import { Label } from "@cardapio/components/Shared/ui/label";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Pen, Trash2 } from "lucide-react";

export default function EnderecoStep({ enderecos, enderecoId, onSelect, onAdd, onUpdate, onDelete }: any) {
  const [selected, setSelected] = useState(String(enderecoId ?? ""));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [novo, setNovo] = useState({ logradouro: "", numero: "", cidade: "", estado: "", cep: "" });

  useEffect(() => setSelected(String(enderecoId ?? "")), [enderecoId]);

  const startEdit = (e: any) => {
    setEditingId(e.id);
    setIsAddingNew(false);
    setNovo({ logradouro: e.logradouro, numero: e.numero || "", cidade: e.cidade, estado: e.estado, cep: e.cep });
  };

  const startAddNew = () => {
    setEditingId(null);
    setIsAddingNew(true);
    setNovo({ logradouro: "", numero: "", cidade: "", estado: "", cep: "" });
  };

  const handleSave = () => {
    if (editingId !== null) onUpdate({ id: editingId, ...novo });
    else onAdd(novo);

    setEditingId(null);
    setIsAddingNew(false);
    setNovo({ logradouro: "", numero: "", cidade: "", estado: "", cep: "" });
  };

  const showForm = editingId !== null || isAddingNew || (!enderecos.length);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Escolha o Endereço</h2>

      <RadioGroup value={selected} onValueChange={(id) => { setSelected(id); onSelect(Number(id)); }}>
        {enderecos.map((e: any) => (
          <div key={e.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <RadioGroupItem value={String(e.id)} id={`end-${e.id}`} />
              <Label htmlFor={`end-${e.id}`}>{e.logradouro}, {e.numero} - {e.bairro} ({e.cidade})</Label>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => startEdit(e)}><Pen/></Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(e.id)}><Trash2/></Button>
            </div>
          </div>
        ))}
      </RadioGroup>

      {showForm && (
        <div className="space-y-2 border p-3 rounded-md mt-2">
          <Input placeholder="Rua" value={novo.logradouro} onChange={(e) => setNovo({ ...novo, logradouro: e.target.value })} />
          <Input placeholder="Número" value={novo.numero} onChange={(e) => setNovo({ ...novo, numero: e.target.value })} />
          <Input placeholder="Cidade" value={novo.cidade} onChange={(e) => setNovo({ ...novo, cidade: e.target.value })} />
          <Input placeholder="Estado" value={novo.estado} onChange={(e) => setNovo({ ...novo, estado: e.target.value })} />
          <Input placeholder="CEP" value={novo.cep} onChange={(e) => setNovo({ ...novo, cep: e.target.value })} />

          <div className="flex gap-2 mt-2">
            <Button onClick={handleSave}>{editingId !== null ? "Salvar Alterações" : "Salvar Endereço"}</Button>
            {(editingId !== null || isAddingNew) && <Button variant="outline" onClick={() => { setEditingId(null); setIsAddingNew(false); }}>Cancelar</Button>}
          </div>
        </div>
      )}

      {!showForm && (
        <Button variant="outline" onClick={startAddNew}>+ Adicionar novo endereço</Button>
      )}
    </div>
  );
}
