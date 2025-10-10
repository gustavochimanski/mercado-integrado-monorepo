"use client";

import { useState } from "react";
import EmpresasTable from "./CadastroEmpresaTable";
import PreviewAdminCardapio from "./PreviewAdminCardapio";
import { EmpresaMensura } from "@supervisor/types/empresas/TypeEmpresasMensura";

export default function EmpresaTabWrapper() {
  const [empresaSelecionada, setEmpresaSelecionada] = useState<EmpresaMensura | null>(null);

  return (
    <div className="flex h-full gap-4">
      {/* Coluna da tabela */}
      <div className="flex-1 min-w-[500px]">
        <EmpresasTable
          selectedEmpresa={empresaSelecionada}
          onSelectEmpresa={setEmpresaSelecionada}
        />
      </div>

      {/* Coluna do preview */}
      <div className="w-[400px]">
        <PreviewAdminCardapio empresaId={empresaSelecionada?.id ?? null} />
      </div>
    </div>
  );
}
