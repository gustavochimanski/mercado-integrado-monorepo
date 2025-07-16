

import { User, Users } from "lucide-react";
import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper";
import ComponentUsuarios from "./ComponentUsuarios";

const TabComponentUsuarios: React.FC = () => {
    const nestedTabItems = [
      {
        value: "usuarios",
        label: (
          <span className="flex items-center gap-2">
            <User size={14} /> Usuários
          </span>
        ),
        Component: <ComponentUsuarios/>,
      },
      {
        value: "grupoUsuarios",
        label: (
          <span className="flex items-center gap-2">
            <Users size={14} /> Grupo Usuários
          </span>
        ),
        Component: <div>Hello</div>,
      }
    ];
  
    return (
      <div className="flex-1 h-full ">
        <TabsWrapper items={nestedTabItems}/>
      </div>
    );
  };

  export default TabComponentUsuarios