
import { Monitor } from "lucide-react";

import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper"; // Componente genérico que renderiza tabs
import TableCadastroProdutos from "@supervisor/components/routes/cadastros/TableCadastroProduto";


// Componente principal da página de cadastros
const PageCadastros = async () => {
  const nestedTabItems = [
    {
      value: "caixas",
      label: (
        <span className="flex items-center gap-2">
          <Monitor size={15} /> Caixas
        </span>
      ),
      Component: <TableCadastroProdutos empresaId={1} />, 
    }
  ];

  return (
    <div className="flex-1 h-full">
      {/* TabsWrapper recebe os itens e renderiza as abas automaticamente */}
      <TabsWrapper items={nestedTabItems} />
    </div>
  );
};

export default PageCadastros;
