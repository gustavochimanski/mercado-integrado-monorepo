"use client"

import TableCupons from "@supervisor/components/routes/marketing/cupons/TableCupons";
import ParceirosTable from "@supervisor/components/routes/marketing/parceiros/ParceirosTable";
// app/seu-caminho/page.tsx (Server Component)
import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper";
import { Handshake, Truck} from "lucide-react";

const PageProcessos = () => {
  
  const nestedTabItems = [
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
        value: "cupons",
        label: (
            <span className="flex items-center gap-2">
            <Truck size={14} /> Cupons
            </span>
        ),
        Component: () => <TableCupons />
    }
  ];

  return (
    <div className="flex-1 h-full">
      <TabsWrapper items={nestedTabItems} />
    </div>
  );
};

export default PageProcessos;
