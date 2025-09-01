"use client";

import { Monitor } from "lucide-react";
import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper";
import EmpresasTable from "@supervisor/components/routes/configuracoes/empresa/CadastroEmpresaTable";
import MeiosPagamentoTable from "@supervisor/components/routes/configuracoes/meioPagamento/MeioPagamentoTable";

const ComponentConfiguracoes: React.FC = () => {
    const nestedTabItems = [
      {
        value: "empresa",
        label: (
          <span className="flex items-center gap-2">
            <Monitor size={14} /> Empresa
          </span>
        ),
        Component: () => <EmpresasTable />,
      },
      {
        value: "meio-pagamento",
        label: (
          <span className="flex items-center gap-2">
            <Monitor size={14} /> Meios de Pagamento
          </span>
        ),
        Component: () => <MeiosPagamentoTable />
      }
    ];
  
    return (
      <div className="flex-1 h-full ">
        <TabsWrapper items={nestedTabItems}/>
      </div>
    );
  };

  export default ComponentConfiguracoes