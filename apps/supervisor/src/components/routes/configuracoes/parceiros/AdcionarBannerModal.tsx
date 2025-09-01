// src/components/routes/configuracoes/parceiros/AdcionarBannerModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@supervisor/components/ui/dialog";
import { Button } from "@supervisor/components/ui/button";
import { Banner, useMutateBanner } from "@supervisor/services/useQueryBanners";
import { BannerForm } from "./BannerForm";
import { toastSucess, toastErro } from "@supervisor/lib/toast";

interface AdicionarBannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parceiro: { id: number; nome: string };
  bannerEdit?: Banner | null;  // 👈 adiciona aqui
  onSaved: () => void;
}

export default function AdicionarBannerModal({
  open,
  onOpenChange,
  parceiro,
  bannerEdit,
  onSaved
}: AdicionarBannerModalProps) {
  const { create, update } = useMutateBanner();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"V" | "H">("V");
  const [ativo, setAtivo] = useState(true);
  const [imagemFile, setImagemFile] = useState<File | null>(null);

  // ⚡️ Quando mudar o bannerEdit, atualiza o form
  useEffect(() => {
    if (bannerEdit) {
      setNome(bannerEdit.nome);
      setTipo(bannerEdit.tipo_banner);
      setAtivo(bannerEdit.ativo);
      setImagemFile(null); // imagem sempre nova
    } else {
      setNome("");
      setTipo("V");
      setAtivo(true);
      setImagemFile(null);
    }
  }, [bannerEdit]);

  const handleSave = async () => {
    if (!nome.trim()) { toastErro("Nome do banner é obrigatório."); return; }

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("tipo_banner", tipo);
      formData.append("ativo", ativo ? "true" : "false");
      formData.append("parceiro_id", String(parceiro.id));
      if (imagemFile) formData.append("imagem", imagemFile);

      if (bannerEdit) {
        await update.mutateAsync({ id: bannerEdit.id, body: formData });
        toastSucess("Banner atualizado!");
      } else {
        await create.mutateAsync(formData);
        toastSucess("Banner criado!");
      }

      onOpenChange(false);
      onSaved();
    } catch (err) {
      toastErro("Erro ao salvar banner.");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{bannerEdit ? "Editar Banner" : "Adicionar Banner"}</DialogTitle>
        </DialogHeader>

        <BannerForm
          banner={bannerEdit ?? null}
          nome={nome} setNome={setNome}
          tipo={tipo} setTipo={setTipo}
          ativo={ativo} setAtivo={setAtivo}
          imagemFile={imagemFile} setImagemFile={setImagemFile}
        />

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>{bannerEdit ? "Atualizar" : "Criar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
