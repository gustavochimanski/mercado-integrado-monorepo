"use client";

import { Banknote, Handshake, Monitor, Truck } from "lucide-react";
import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper";
import MeiosPagamentoTable from "@supervisor/components/routes/configuracoes/meioPagamento/MeioPagamentoTable";
import ParceirosTable from "@supervisor/components/routes/configuracoes/parceiros/ParceirosTable";
import EmpresaTabWrapper from "@supervisor/components/routes/configuracoes/empresa/TabWrapperEmpresa";
import EntregadoresTable from "@supervisor/components/routes/configuracoes/entregadores/EntregadoresTable";

const ComponentConfiguracoes = () => {
    const nestedTabItems = [
      {
        value: "empresa",
        label: (
          <span className="flex items-center gap-2">
            <Monitor size={14} /> Empresa
          </span>
        ),
        Component: () => <EmpresaTabWrapper />,
      },
      {
        value: "meio-pagamento",
        label: (
          <span className="flex items-center gap-2">
            <Banknote size={14} /> Meios de Pagamento
          </span>
        ),
        Component: () => <MeiosPagamentoTable />
      },
      {
        value: "parceiros",
        label: (
          <span className="flex items-center gap-2">
            <Handshake size={14} /> Parceiros
          </span>
        ),
        Component: () => <ParceirosTable />
      },
      {
        value: "entregadores",
        label: (
          <span className="flex items-center gap-2">
            <Truck size={14} /> Entregadores
          </span>
        ),
        Component: () => <EntregadoresTable />
      }
    ];
  
    return (
      <div className="flex-1 h-full ">
        <TabsWrapper items={nestedTabItems}/>
      </div>
    );
  };

  export default ComponentConfiguracoes