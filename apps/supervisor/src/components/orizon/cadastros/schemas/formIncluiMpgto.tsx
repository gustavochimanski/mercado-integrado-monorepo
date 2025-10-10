// components/FormIncluirMeioPgto.tsx
"use client";

import React from "react";
import { CardHeader, CardTitle, CardContent, CardFooter } from "@supervisor/components/ui/card";
import { Label } from "@supervisor/components/ui/label";
import { Input } from "@supervisor/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { Button } from "@supervisor/components/ui/button";

export interface FormData {
  descricao: string;
  tipoMeioPgto: string;
}

interface FormIncluirMeioPgtoProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const FormIncluirMeioPgto: React.FC<FormIncluirMeioPgtoProps> = ({
  formData,
  onChange,
  onSubmit,
  onClose,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader className="text-center">
        <CardTitle>Incluir Novo Perfil</CardTitle>
      </CardHeader>
      <CardContent className="p-10 gap-4 flex flex-col">
        {/* Campo Descrição */}
        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Input
            id="descricao"
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={(e) => onChange("descricao", e.target.value)}
          />

        </div>
        {/* Campo Tipo de Meio de Pagamento */}
        <div>
          <Label htmlFor="tipoMeioPgto">Tipo</Label>
          <Select
            value={formData.tipoMeioPgto}
            onValueChange={(value: string) => onChange("tipoMeioPgto", value)}
          >
            <SelectTrigger className="md:w-1/2" id="tipoMeioPgto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="D">Dinheiro</SelectItem>
              <SelectItem value="C">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="justify-between mt-4">
        <Button variant="destructive" onClick={onClose}>
          Fechar
        </Button>
        <Button type="submit">Salvar</Button>
      </CardFooter>
    </form>
  );
};

export default FormIncluirMeioPgto;
