"use client";

import { useState } from "react";
import ComponentPerfilPdv from "./perfil/ComponentPerfilPdv";
import ComponentConfigPerfilPDV from "./config/ComponentConfigPerfilPdv";
import { useFetchAllPerfil } from "../../../hooks/usePerfisDeCaixa";
import { Card, CardContent } from "@supervisor/components/ui/card";

const TabComponentPerfilPdv = () => {
  const [rowSelected, setRowSelected] = useState<any>();
  const [modoEdicao, setModoEdicao] = useState(false);

  const { data: dataAllperfil } = useFetchAllPerfil();

  return (
    <div className="flex flex-row w-full overflow-auto h-full gap-4">
      {/* Lista de Perfis */}
      <Card className="flex-1">
        <CardContent className="flex-1 h-full">
          <ComponentPerfilPdv
            data={dataAllperfil}
            setRowSelected={setRowSelected}
            setModoEdicao={setModoEdicao}
          />
        </CardContent>
      </Card>

      {/* Configurações do perfil */}
      <Card className="flex-1">
        <CardContent className="flex-1 h-full">
          <ComponentConfigPerfilPDV
            data={rowSelected}
            modoEdicao={modoEdicao}
            setModoEdicao={setModoEdicao}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TabComponentPerfilPdv;
