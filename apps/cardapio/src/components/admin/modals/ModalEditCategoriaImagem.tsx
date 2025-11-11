"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Label } from "@cardapio/components/Shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  useCategoriaById,
  useMutateCategoria,
} from "@cardapio/services/useQueryCategoria";
import { validateImageWithFeedback } from "@cardapio/lib/validations/imageValidation";

interface ModalEditCategoriaImagemProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
  categoriaId: number;
}

export const ModalEditCategoriaImagem = ({
  open,
  onOpenChange,
  empresaId,
  categoriaId,
}: ModalEditCategoriaImagemProps) => {
  const {
    data: categoria,
    isLoading,
    isError,
  } = useCategoriaById(open ? categoriaId : null, { enabled: open });

  const [imagemFile, setImagemFile] = useState<File | undefined>(undefined);
  const [imagemError, setImagemError] = useState<string | null>(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);

  const { uploadImagem } = useMutateCategoria();
  const isUploading = uploadImagem.isPending;

  useEffect(() => {
    if (!open) {
      setImagemFile(undefined);
      setImagemError(null);
      setIsValidatingImage(false);
    }
  }, [open]);

  useEffect(() => {
    if (!categoria) return;
    setImagemFile(undefined);
    setImagemError(null);
    setIsValidatingImage(false);
  }, [categoria]);

  const handleImageChange = async (file: File | undefined) => {
    setImagemFile(file);
    setImagemError(null);

    if (!file) return;

    setIsValidatingImage(true);
    try {
      const validation = await validateImageWithFeedback(file, "categoria");

      if (!validation.isValid) {
        setImagemError(validation.error || "Erro na validação da imagem");
      }
    } catch (error) {
      setImagemError("Erro inesperado na validação da imagem");
    } finally {
      setIsValidatingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!categoria || !imagemFile) return;

    setIsValidatingImage(true);
    const validation = await validateImageWithFeedback(imagemFile, "categoria");
    setIsValidatingImage(false);

    if (!validation.isValid) {
      setImagemError(validation.error || "Erro na validação da imagem");
      return;
    }

    uploadImagem.mutate(
      {
        id: categoria.id,
        cod_empresa: empresaId,
        imagem: imagemFile,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Carregando categoria...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError || !categoria) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar imagem da categoria</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Imagem atual</Label>
            <div className="relative w-24 h-24 rounded overflow-hidden bg-muted">
              {categoria.imagem ? (
                <Image
                  src={categoria.imagem}
                  alt={categoria.label}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  Sem imagem
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria-imagem">Nova imagem</Label>
            <Input
              id="categoria-imagem"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                await handleImageChange(file);
              }}
              className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />

            {isValidatingImage && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Validando imagem...
              </div>
            )}

            {imagemFile && !imagemError && !isValidatingImage && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                Imagem válida ({imagemFile.name})
              </div>
            )}

            {imagemError && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {imagemError}
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              Formatos aceitos: JPEG, JPG, PNG, WEBP • Máximo: 512x512 pixels • Tamanho: até 5MB
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading || isValidatingImage}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUploading || isValidatingImage || !!imagemError || !imagemFile}
          >
            {isUploading ? "Enviando..." : "Salvar imagem"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

