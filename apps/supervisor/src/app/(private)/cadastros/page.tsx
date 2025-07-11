
import {
  BanknoteIcon,
  Building,
  CircleUser,
  HandCoins,
  Menu,
  Monitor,
  Mouse,
  Network,
} from "lucide-react"; // Ícones para ilustrar cada aba

// 🧩 Importa os componentes de cada aba (um por domínio do sistema)
import { TabComponentPerifericos } from "./components/tabs/perifericos/TabComponentPerifericos";
import TabComponentEmpresas from "./components/tabs/empresas/TabComponentEmpresas";
import TabComponentFiscal from "./components/tabs/fiscal/TabComponentFiscal";
import TabComponentMainCaixas from "./components/tabs/caixas/TabComponentMainCaixas";
import TabComponentPerfilPdv from "./components/tabs/PerfilPdv/TabComponentPerfilPdv";
import TabComponentUsuarios from "./components/tabs/usuarios/TabComponentMainUsuarios";
import TabComponentMeioPagamento from "./components/tabs/meioPagamento/TabComponentMeioPag";

import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper"; // Componente genérico que renderiza tabs
import { fetchAllCaixasSSR } from "./services/PdvsService"; // Função que busca dados de caixas no lado servidor (SSR)


// Componente principal da página de cadastros
const PageCadastros = async () => {
  // Faz uma requisição SSR para buscar os dados dos caixas (evita flash na tela com CSR)
  const caixasSSR = await fetchAllCaixasSSR();

  // Lista de abas que serão renderizadas no TabsWrapper
  const nestedTabItems = [
    {
      value: "caixas",
      label: (
        <span className="flex items-center gap-2">
          <Monitor size={15} /> Caixas
        </span>
      ),
      Component: <TabComponentMainCaixas caixasSSR={caixasSSR} />, // passa os dados de SSR como prop
    },
    {
      value: "perfilPdv",
      label: (
        <span className="flex items-center gap-2">
          <Network size={15} /> Perfil PDV
        </span>
      ),
      Component: <TabComponentPerfilPdv />,
    },
    {
      value: "usuarios",
      label: (
        <span className="flex items-center gap-2">
          <CircleUser size={15} /> Usuários
        </span>
      ),
      Component: <TabComponentUsuarios />,
    },
    {
      value: "empresas",
      label: (
        <span className="flex items-center gap-2">
          <Building size={15} /> Empresas
        </span>
      ),
      Component: <TabComponentEmpresas />,
    },
    {
      value: "meios-de-pagamento",
      label: (
        <span className="flex items-center gap-2">
          <BanknoteIcon size={15} /> Meios de Pagamento
        </span>
      ),
      Component: <TabComponentMeioPagamento />,
    },
    {
      value: "perifericos",
      label: (
        <span className="flex items-center gap-2">
          <Mouse size={15} /> Periféricos
        </span>
      ),
      Component: <TabComponentPerifericos />,
    },
    {
      value: "fiscal",
      label: (
        <span className="flex items-center gap-2">
          <HandCoins size={15} /> Fiscal
        </span>
      ),
      Component: <TabComponentFiscal />,
    },
    {
      value: "outros",
      label: (
        <span className="flex items-center gap-2">
          <Menu size={15} /> Outros
        </span>
      ),
      Component: <div>Outros</div>,
    },
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
