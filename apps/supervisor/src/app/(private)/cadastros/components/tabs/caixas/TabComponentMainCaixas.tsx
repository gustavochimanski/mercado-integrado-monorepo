"use client";

import { useState } from "react";
import { TypeCaixas } from "../../../types/typesPDVS";
import { Card, CardContent, CardHeader, CardTitle } from "@supervisor/components/ui/card";
import ComponentPdvs from "./pdvs/ComponentPdvs";
import CardConfigPerfilPdv from "./config/ComponentConfPerfilPdv";

type Props = {
  caixasSSR: TypeCaixas[];
};

const TabComponentMainCaixas = ({ caixasSSR }: Props) => {
  const [rowSelected, setRowSelected] = useState<any>();
  const [modoEdicao, setModoEdicao] = useState(false);

  const [idPerfilSelected, setIdPerfilSelected] = useState<string | undefined>();

  return (
    <div className="flex flex-row w-full overflow-auto h-full gap-4">
      {/* Seção Pdvs */}
      <Card>
        <CardHeader>
          <CardTitle>Pdvs</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 h-full">
          <ComponentPdvs
            setRowSelectedProp={(row) => {
              setRowSelected(row);
              setIdPerfilSelected(row?.perfilPdv?.id?.toString());
            }}
            caixasSSR={caixasSSR}
            setModoEdicao={setModoEdicao}
          />
        </CardContent>
      </Card>

      {/* Seção Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Perfil de Pdv</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 h-full">
          <CardConfigPerfilPdv
            dataSSR={rowSelected}
            modoEdicao={modoEdicao}
            setModoEdicao={setModoEdicao}
            idPerfilSelected={idPerfilSelected}
            setIdPerfilSelected={setIdPerfilSelected}
            setRowSelected={setRowSelected} // ⬅ importante pra refletir a troca do perfil no pai
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TabComponentMainCaixas;
