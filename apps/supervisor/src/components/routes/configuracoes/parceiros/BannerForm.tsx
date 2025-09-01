"use client";
import { Input } from "@supervisor/components/ui/input";
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
  return (
    <div className="flex flex-col gap-4 mt-6 border-t pt-4">
      <h4 className="font-semibold">{banner ? "Editar Banner" : "Novo Banner"}</h4>

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
  );
}
