"use client";

import { Monitor } from "lucide-react";
import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper";
import EmpresasTable from "@supervisor/components/routes/configuracoes/CadastroEmpresaTable";

const ComponentConfiguracoes: React.FC = () => {
    const nestedTabItems = [
      {
        value: "caixas",
        label: (
          <span className="flex items-center gap-2">
            <Monitor size={14} /> Empresa
          </span>
        ),
        Component: () => <EmpresasTable />,
      }
    ];
  
    return (
      <div className="flex-1 h-full ">
        <TabsWrapper items={nestedTabItems}/>
      </div>
    );
  };

  export default ComponentConfiguracoes