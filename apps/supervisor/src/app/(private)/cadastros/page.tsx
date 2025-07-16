
import { Monitor } from "lucide-react"; // Ícones para ilustrar cada aba

// 🧩 Importa os componentes de cada aba (um por domínio do sistema)
import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper"; // Componente genérico que renderiza tabs
import { fetchAllCaixasSSR } from "../../../components/orizon/cadastros/services/PdvsService"; // Função que busca dados de caixas no lado servidor (SSR)
import TableCadastroProdutos from "@supervisor/components/routes/cadastros/TableCadastroProduto";


// Componente principal da página de cadastros
const PageCadastros = async () => {
  // Faz uma requisição SSR para buscar os dados dos caixas (evita flash na tela com CSR)

  // Lista de abas que serão renderizadas no TabsWrapper
  const nestedTabItems = [
    {
      value: "caixas",
      label: (
        <span className="flex items-center gap-2">
          <Monitor size={15} /> Caixas
        </span>
      ),
      Component: <TableCadastroProdutos empresaId={1} />, // passa os dados de SSR como prop
    }
  ];

  // 📦 Renderiza as abas na tela
  return (
    <div className="flex-1 h-full">
      {/* TabsWrapper recebe os itens e renderiza as abas automaticamente */}
      <TabsWrapper items={nestedTabItems} />
    </div>
  );
};

export default PageCadastros;
