"use client";

import { Handshake, Tag } from "lucide-react";
import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper";
import ParceirosTable from "@supervisor/components/routes/marketing/parceiros/ParceirosTable";
import TableCupons from "@supervisor/components/routes/marketing/cupons/TableCupons";

const PageMarketing = () => {
  const nestedTabItems = [
    {
      value: "parceiros",
      label: (
        <span className="flex items-center gap-2">
          <Handshake size={14} /> Parceiros
        </span>
      ),
      Component: () => <ParceirosTable />,
    },
    {
      value: "cupons",
      label: (
        <span className="flex items-center gap-2">
          <Tag size={14} /> Cupons
        </span>
      ),
      Component: () => <TableCupons />,
    },
  ];

  return (
    <div className="flex-1 h-full">
      <TabsWrapper items={nestedTabItems} />
    </div>
  );
};

export default PageMarketing;
