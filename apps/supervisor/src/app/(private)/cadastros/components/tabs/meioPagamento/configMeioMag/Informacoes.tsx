// InfoSection.tsx
import React from "react";
import { Input } from "@supervisor/components/ui/input";
import { CardTitle } from "@supervisor/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";

interface InfoSectionProps {
  dadosMeioPgto: { id: number | string; descricao?: string; tipoMeioPgto: string };
  setDescricao: (descricao: string) => void;
  setTipoMpgto: (tipoMeioPgto: string) => void;
}

const InfoSection: React.FC<InfoSectionProps> = ({ dadosMeioPgto, setDescricao, setTipoMpgto }) => {
  return (
    <div>
      <div className="flex justify-center md:justify-normal gap-2 font-sans">
        <div className="flex flex-col gap-1 items-center">
          <CardTitle>Id</CardTitle>
          <Input
            id="id"
            value={dadosMeioPgto.id.toString()}
            className="w-12 text-center bg-slate-300"
            disabled
          />
        </div>
        <div className="flex flex-col gap-1">
          <CardTitle>Descrição</CardTitle>
          <Input
            id="descricao"
            value={dadosMeioPgto.descricao || ""}
            onChange={(evt) => setDescricao(evt.target.value)}
            className="w-full md:w-52"
          />
        </div>
        {/* API NAO ESTA FUNCIONADO AINDA */}
        <div className="flex flex-col gap-1">
          <CardTitle>Tipo</CardTitle>
          <Select
            value={dadosMeioPgto.tipoMeioPgto|| "Definir"}
            onValueChange={(evt) => setTipoMpgto(evt)}
          >
            <SelectTrigger className="md:w-1/2" id="tipoMeioPgto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="C">Cartão</SelectItem>
              <SelectItem value="D">Dinheiro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
    </div>
  );
};

export default InfoSection;
