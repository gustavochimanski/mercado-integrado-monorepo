import Tabs from "@supervisor/components/shared/tabs/tabs";
import { Keyboard, Monitor, Printer } from "lucide-react";

export const TabComponentPerifericos: React.FC = () => {
    const nestedTabItems = [
      {
        value: "impressora",
        label: (
          <span className="flex items-center gap-2">
            <Printer size={14} /> Impressora
          </span>
        ),
        Component: <div>🖨️ Configurações de Impressora</div>
      },
      {
        value: "teclado",
        label: (
          <span className="flex items-center gap-2">
            <Keyboard size={14} /> Teclado
          </span>
        ),
        Component:  <div>⌨️ Configurações de Teclado</div>
      },
      {
        value: "tela",
        label: (
          <span className="flex items-center gap-2">
            <Monitor size={14} /> Monitor
          </span>
        ),
        Component: <div>⌨️ Configurações do Monitor</div>
      },
    ];
  
    return (
      <Tabs
        items={nestedTabItems}
        containerClassName="w-full rounded-sm shadow h-full"
        triggerClassName="transition-colors"
        contentClassName="bg-sidebarrounded-sm h-[70vh]"
      />
    );
  };
  