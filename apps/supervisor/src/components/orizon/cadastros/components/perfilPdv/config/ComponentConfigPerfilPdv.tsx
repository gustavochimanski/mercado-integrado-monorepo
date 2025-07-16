"use client";

import { TypePerfilPdv } from "@supervisor/components/orizon/cadastros/types/typesPDVS";
import { Button } from "@supervisor/components/ui/button";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@supervisor/components/ui/card";
import { Input } from "@supervisor/components/ui/input";
import { CardContent } from "@mui/material";
import { CircleCheck, CircleX } from "lucide-react";

type Props = {
  data: TypePerfilPdv;
  modoEdicao?: boolean;
  setModoEdicao?: (ativo: boolean) => void;
};

const ComponentConfigPerfilPDV = ({ data, modoEdicao, setModoEdicao }: Props) => {
  if (!data) return <div className="mx-6">Selecione um <strong>caixa</strong> para visualizar.</div>;

  const confPerfil = data.confPerfil;



  return (
    <div className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Configurações do Perfil de Hardware</CardTitle>
        <CardDescription><strong>{data.descricao}</strong></CardDescription>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-4 text-xs flex-1 h-full">
        {confPerfil.map((config: any) => (
          <div
            key={config.id}
            className="flex flex-col w-[calc(50%-0.5rem)] max-w-[150px] min-w-[50px]"

          >
            <label className="font-semibold">{config.property}</label>
            <Input
              defaultValue={config.value}
              name={config.property}
              className="h-8"
              disabled={!modoEdicao}
            />
          </div>
        ))}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button disabled={!modoEdicao}>
          <CircleCheck className="mr-2" /> Gravar
        </Button>
        <Button
          variant="secondary"
          onClick={() => setModoEdicao?.(false)}
          disabled={!modoEdicao}
        >
          <CircleX className="mr-2" /> Cancelar
        </Button>
      </CardFooter>
    </div>
  );
};

export default ComponentConfigPerfilPDV;
