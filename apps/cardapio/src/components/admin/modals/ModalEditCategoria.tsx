"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Label } from "@cardapio/components/Shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import {
  useCategoriaById,
  useMutateCategoria,
} from "@cardapio/services/useQueryCategoria";
import { validateImageWithFeedback } from "@cardapio/lib/validations/imageValidation";
import { AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";

interface ModalEditCategoriaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
  categoriaId: number;
}

export const ModalEditCategoria = ({
  open,
  onOpenChange,
  empresaId,
  categoriaId,
}: ModalEditCategoriaProps) => {
  // Busca a categoria pelo ID
const {
  data: categoria,
  isLoading,
  isError,
} = useCategoriaById(open ? categoriaId : null, { enabled: open });

  // Estados do form
  const [descricao, setDescricao] = useState("");
  const [imagemFile, setImagemFile] = useState<File | undefined>(undefined);
  const [imagemError, setImagemError] = useState<string | null>(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);

  // Mutations
  const { update, uploadImagem } = useMutateCategoria();
  const isUpdating = update.isPending || uploadImagem.isPending;

  // Preenche o form quando carrega
  useEffect(() => {
    if (categoria) {
      setDescricao(categoria.label);
      setImagemFile(undefined);
      setImagemError(null);
      setIsValidatingImage(false);
    }
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

  // Salvar alterações
  const handleSubmit = async () => {
    if (!descricao.trim() || !categoria) return;
    
    // Se há imagem, valida antes de enviar
    if (imagemFile) {
      setIsValidatingImage(true);
      const validation = await validateImageWithFeedback(imagemFile, "categoria");
      setIsValidatingImage(false);
      
      if (!validation.isValid) {
        setImagemError(validation.error || "Erro na validação da imagem");
        return;
      }
    }

    // Atualiza a categoria
    update.mutate({
      cod_empresa: empresaId,
      id: categoria.id,
      descricao,
      slug: categoria.slug,
      parent_id: categoria.parent_id ?? null,
      posicao: categoria.posicao,
    });
    
    // Se tiver imagem nova, faz upload
    if (imagemFile) {
      uploadImagem.mutate({
        id: categoria.id,
        cod_empresa: empresaId,
        imagem: imagemFile,
      });
    }
    
    onOpenChange(false);
  };

  // Loading / Erro
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

  // Render
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição da categoria</Label>
            <Input
              id="descricao"
              placeholder="Digite a descrição da categoria"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagem">Imagem da categoria (opcional)</Label>
            
            {categoria.imagem && !imagemFile && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Imagem atual:</div>
                <div className="relative w-20 h-20">
                  <Image
                    src={categoria.imagem}
                    alt="Imagem atual"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Input
                id="imagem"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  await handleImageChange(file);
                }}
                className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
              />
              
              {/* Feedback visual da validação */}
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
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating || isValidatingImage}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isUpdating || isValidatingImage || !!imagemError}
          >
            {isUpdating ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
