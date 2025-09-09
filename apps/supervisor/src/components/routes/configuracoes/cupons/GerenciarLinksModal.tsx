"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@supervisor/components/ui/card";
import { Button } from "@supervisor/components/ui/button";
import { Input } from "@supervisor/components/ui/input";
import { useMutateCupomLink, CupomLink } from "@supervisor/services/useQueryCupons";

interface GerenciarLinksCardProps {
  cupomId: number;
  initialLinks?: CupomLink[];
}

export default function GerenciarLinksCard({ cupomId, initialLinks = [] }: GerenciarLinksCardProps) {
  const { create, update, remove } = useMutateCupomLink(cupomId);

  const [links, setLinks] = useState<CupomLink[]>(initialLinks);
  const [editingLinks, setEditingLinks] = useState<{ [id: number]: { titulo: string; url: string } }>(
    initialLinks.reduce((acc, l) => ({ ...acc, [l.id]: { titulo: l.titulo, url: l.url } }), {})
  );
  const [editingIds, setEditingIds] = useState<number[]>([]);
  const [newTitulo, setNewTitulo] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAdd = async () => {
    if (!newTitulo.trim() || !newUrl.trim()) return;
    const res = await create.mutateAsync({ titulo: newTitulo, url: newUrl });
    setLinks((prev) => [...prev, res.data]);
    setEditingLinks((prev) => ({ ...prev, [res.data.id]: { titulo: res.data.titulo, url: res.data.url } }));
    setNewTitulo("");
    setNewUrl("");
  };

  const handleEdit = (id: number) => {
    if (!editingIds.includes(id)) setEditingIds((prev) => [...prev, id]);
  };

  const handleSave = async (id: number) => {
    const { titulo, url } = editingLinks[id];
    const res = await update.mutateAsync({ id, titulo, url });
    setLinks((prev) => prev.map((l) => (l.id === id ? res.data : l)));
    setEditingIds((prev) => prev.filter((eid) => eid !== id));
  };

  const handleRemove = async (id: number) => {
    await remove.mutateAsync(id);
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setEditingLinks((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setEditingIds((prev) => prev.filter((eid) => eid !== id));
  };

  return (
    <Card className="mt-4 p-4 w-full max-w-3xl">
      <CardHeader className="p-0 mb-2">
        <CardTitle>Gerenciar Links do Cupom</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {links.map((link) => {
          const isEditing = editingIds.includes(link.id);
          return (
            <div key={link.id} className="flex gap-2 items-center w-full">
              <Input
                className="flex-1"
                value={editingLinks[link.id]?.titulo ?? link.titulo}
                placeholder="Título"
                disabled={!isEditing}
                onChange={(e) =>
                  setEditingLinks((prev) => ({
                    ...prev,
                    [link.id]: { ...(prev[link.id] || {}), titulo: e.target.value },
                  }))
                }
              />
              <Input
                className="flex-1"
                value={editingLinks[link.id]?.url ?? link.url}
                placeholder="URL"
                disabled={!isEditing}
                onChange={(e) =>
                  setEditingLinks((prev) => ({
                    ...prev,
                    [link.id]: { ...(prev[link.id] || {}), url: e.target.value },
                  }))
                }
              />
              {!isEditing ? (
                <Button onClick={() => handleEdit(link.id)}>Editar</Button>
              ) : (
                <Button onClick={() => handleSave(link.id)}>Salvar</Button>
              )}
              <Button variant="destructive" onClick={() => handleRemove(link.id)}>
                Remover
              </Button>
            </div>
          );
        })}

        {/* Adicionar novo link */}
        <div className="flex gap-2 items-center mt-2 w-full">
          <Input
            className="flex-1"
            placeholder="Novo título"
            value={newTitulo}
            onChange={(e) => setNewTitulo(e.target.value)}
          />
          <Input
            className="flex-1"
            placeholder="Nova URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <Button onClick={handleAdd}>Adicionar</Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 mt-2">
        <Button variant="outline" onClick={() => setLinks(initialLinks)}>
          Resetar
        </Button>
      </CardFooter>
    </Card>
  );
}
