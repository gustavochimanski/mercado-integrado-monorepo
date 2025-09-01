"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@supervisor/components/ui/dialog";
import { Button } from "@supervisor/components/ui/button";
import { Input } from "@supervisor/components/ui/input";
import { toastSucess, toastErro } from "@supervisor/lib/toast";
import { Banner, useBanners, useMutateBanner } from "@supervisor/services/useQueryBanners";

interface ParceiroBannersProps {
  parceiroId: number;
}

export default function ParceiroBanners({ parceiroId }: ParceiroBannersProps) {
  const { data: banners } = useBanners();
  const { create, update, remove } = useMutateBanner();
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"V" | "H">("V");
  const [ativo, setAtivo] = useState(true);
  const [imagemFile, setImagemFile] = useState<File | null>(null);

  // Carrega dados ao editar
  useEffect(() => {
    if (editingBanner) {
      setNome(editingBanner.nome);
      setTipo(editingBanner.tipo_banner);
      setAtivo(editingBanner.ativo);
      setImagemFile(null); // nova imagem opcional
    } else {
      setNome("");
      setTipo("V");
      setAtivo(true);
      setImagemFile(null);
    }
  }, [editingBanner, showModal]);

  const handleSave = async () => {
    if (!nome.trim()) {
      toastErro("Nome do banner é obrigatório.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("tipo_banner", tipo);
      formData.append("ativo", ativo ? "true" : "false");
      formData.append("parceiro_id", String(parceiroId));
      if (imagemFile) formData.append("imagem", imagemFile);

      if (editingBanner) {
        // ⚡ Passando id separado e body como FormData
        await update.mutateAsync({ id: editingBanner.id, body: formData });
        toastSucess("Banner atualizado!");
      } else {
        await create.mutateAsync(formData);
        toastSucess("Banner criado!");
      }

      setShowModal(false);
      setEditingBanner(null);
      setImagemFile(null);
    } catch (err) {
      toastErro("Erro ao salvar banner.");
      console.error(err);
    }
  };


  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setShowModal(true);
  };

  const handleRemove = async (bannerId: number) => {
    if (!confirm("Deseja realmente remover este banner?")) return;
    try {
      await remove.mutateAsync(bannerId);
      toastSucess("Banner removido!");
    } catch {
      toastErro("Erro ao remover banner.");
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Banners do Parceiro</h3>

      {/* Grid de banners */}
      <div className="grid grid-cols-3 gap-4">
        {banners?.filter(b => b.parceiro_id === parceiroId).map((b) => (
          <div key={b.id} className="border p-2 rounded flex flex-col gap-2">
            <img src={b.imagem} alt={b.nome} className="w-full h-24 object-cover rounded" />
            <p className="font-medium">{b.nome}</p>
            <p className="text-sm text-gray-500">{b.tipo_banner}</p>
            <div className="flex gap-1">
              <Button size="sm" onClick={() => handleEdit(b)}>Editar</Button>
              <Button size="sm" variant="destructive" onClick={() => handleRemove(b.id)}>Remover</Button>
            </div>
          </div>
        ))}
        {/* Card para adicionar novo banner */}
        <div className="border p-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50" onClick={() => setShowModal(true)}>
          + Adicionar
        </div>
      </div>

      {/* Modal de criar/editar */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Editar Banner" : "Novo Banner"}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            <label>Nome</label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />

            <label>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value as "V" | "H")}>
              <option value="V">Vertical</option>
              <option value="H">Horizontal</option>
            </select>

            <label>Ativo</label>
            <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />

            <label>Imagem</label>
            <Input type="file" accept="image/*" onChange={(e) => setImagemFile(e.target.files?.[0] ?? null)} />
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingBanner ? "Atualizar" : "Criar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
