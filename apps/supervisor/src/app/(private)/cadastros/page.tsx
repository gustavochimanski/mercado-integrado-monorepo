"use client"
import { Package, Users } from "lucide-react";

import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper"; // Componente genérico que renderiza tabs
import TableCadastroProdutos from "@supervisor/components/routes/cadastros/produtos/TableCadastroProduto";
import TableCadastroClientes from "@supervisor/components/routes/cadastros/clientes/TableCadastroClientes";


// Componente principal da página de cadastros
const PageCadastros = () => {
  const nestedTabItems = [
    {
      value: "produtos",
      label: (
        <span className="flex items-center gap-2">
          <Package size={15} /> Produtos
        </span>
      ),
      Component: () => <TableCadastroProdutos empresaId={1} />,
    },
    {
      value: "clientes",
      label: (
        <span className="flex items-center gap-2">
          <Users size={15} /> Clientes
        </span>
      ),
      Component: () => <TableCadastroClientes empresaId={1} />,
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
