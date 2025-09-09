"use client";
import * as React from "react";
import { Input } from "@supervisor/components/ui/input";
import { Label } from "@supervisor/components/ui/label";
import { Switch } from "@supervisor/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { Banner } from "@supervisor/services/useQueryBanners";

interface BannerFormProps {
  banner?: Banner | null;
  nome: string;
  setNome: (v: string) => void;
  tipo: "V" | "H";
  setTipo: (v: "V" | "H") => void;
  ativo: boolean;
  setAtivo: (v: boolean) => void;
  imagemFile: File | null;
  setImagemFile: (f: File | null) => void;
}

export function BannerForm({
  banner,
  nome, setNome,
  tipo, setTipo,
  ativo, setAtivo,
  imagemFile, setImagemFile
}: BannerFormProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (imagemFile) {
      const url = URL.createObjectURL(imagemFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(banner?.imagem ?? null);
    }
  }, [imagemFile, banner]);

  return (
    <div className="flex flex-col gap-6 mt-6 border-t pt-4">
      {/* Nome */}
      <div className="flex items-center gap-4">

        <div className="flex flex-col gap-1 w-full">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome do banner" />
        </div>

        {/* Tipo */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="tipo">Tipo</Label>
          <Select value={tipo} onValueChange={(v) => setTipo(v as "V" | "H")}>
            <SelectTrigger id="tipo" className="w-48">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="V">Vertical</SelectItem>
              <SelectItem value="H">Horizontal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ativo */}
        <div className="flex gap-2 h-full items-end mb-2  text-muted-foreground ">
          <Label htmlFor="ativo" className="mb-1" >Ativo</Label>
          <Switch id="ativo" checked={ativo} onCheckedChange={setAtivo} />
        </div>

      </div>

      {/* Imagem */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="imagem">Imagem</Label>
        <Input
          id="imagem"
          type="file"
          accept="image/*"
          onChange={(e) => setImagemFile(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
}
