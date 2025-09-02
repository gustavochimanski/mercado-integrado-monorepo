// src/components/routes/configuracoes/parceiros/AdcionarBannerModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@supervisor/components/ui/dialog";
import { Button } from "@supervisor/components/ui/button";
import { Banner, useMutateBanner } from "@supervisor/services/useQueryBanners";
import { BannerForm } from "./BannerForm";
import { useCategoriasSearch } from "@supervisor/services/useSearchCategoria";
import Image from "next/image";
import { Label } from "@supervisor/components/ui/label";
import { Input } from "@supervisor/components/ui/input";
import { useToast } from "@supervisor/hooks/use-toast";

interface AdicionarBannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parceiro: { id: number; nome: string };
  bannerEdit?: Banner | null;
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
  const { toast } = useToast();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<"V" | "H">("V");
  const [ativo, setAtivo] = useState(true);
  const [imagemFile, setImagemFile] = useState<File | null>(null);

  // --- categoria ---
  const [buscaCat, setBuscaCat] = useState("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);
  const { data: categorias = [], isLoading: loadingCats } = useCategoriasSearch(buscaCat, {
    enabled: open,
    debounceMs: 300,
    limit: 50,
    allowEmpty: false,
  });

  useEffect(() => {
    if (bannerEdit) {
      setNome(bannerEdit.nome);
      setTipo(bannerEdit.tipo_banner);
      setAtivo(bannerEdit.ativo);
      setSelectedCategoriaId(bannerEdit.categoria_destino ?? null);
      setImagemFile(null);
    } else {
      setNome("");
      setTipo("V");
      setAtivo(true);
      setSelectedCategoriaId(null);
      setImagemFile(null);
    }
  }, [bannerEdit]);

  const handleSave = async () => {
    if (!nome.trim()) { 
      toast({ title: "Erro", description: "Nome do banner é obrigatório." }); 
      return; 
    }
    if (!selectedCategoriaId) { 
      toast({ title: "Erro", description: "Selecione uma categoria." }); 
      return; 
    }

    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("tipo_banner", tipo);
      formData.append("ativo", ativo ? "true" : "false");
      formData.append("parceiro_id", String(parceiro.id));
      formData.append("categoria_id", String(selectedCategoriaId));
      if (imagemFile) formData.append("imagem", imagemFile);

      if (bannerEdit) {
        await update.mutateAsync({ id: bannerEdit.id, body: formData });
        toast({ title: "Banner atualizado", description: "Banner atualizado com sucesso." });
      } else {
        await create.mutateAsync(formData);
        toast({ title: "Banner criado", description: "Banner criado com sucesso." });
      }

      onOpenChange(false);
      onSaved();
    } catch (err: any) {
      toast({ title: "Erro ao salvar banner", description: err?.message || "Ocorreu um erro inesperado." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[95vh]">
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

        {/* Seleção de Categoria */}
        <div className="mt-6">
          <Label className="block text-sm font-medium mb-1">Categoria Destino</Label>
          <Input
            type="text"
            placeholder="Pesquisar categoria..."
            value={buscaCat}
            onChange={(e) => setBuscaCat(e.target.value)}
            className="mb-4 w-full border rounded px-2 py-1"
          />
          <div className="grid grid-cols-4 gap-4 max-h-72 overflow-auto">
            {loadingCats && <div className="col-span-full text-sm text-muted-foreground">Carregando categorias...</div>}
            {categorias.map(cat => {
              const isSelected = selectedCategoriaId === cat.id;
              return (
                <div key={cat.id} className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${isSelected ? "border-primary" : "border-muted"}`}>
                  <div className="w-full h-32 relative bg-gray-100">
                    {cat.imagem ? (
                      <Image src={cat.imagem} alt={cat.descricao} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center text-xs text-muted-foreground">Sem imagem</div>
                    )}
                  </div>
                  <div className="p-2 flex flex-col gap-1 text-center">
                    <span className="text-sm font-medium line-clamp-2">{cat.descricao}</span>
                    <span className="text-xs text-muted-foreground">/{cat.slug}</span>
                    <Button
                      type="button"
                      variant={isSelected ? "default" : "secondary"}
                      onClick={() => setSelectedCategoriaId(cat.id)}
                      className="mt-2 text-xs"
                    >
                      {isSelected ? "Selecionada" : "Selecionar"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="mt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>{bannerEdit ? "Atualizar" : "Criar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
