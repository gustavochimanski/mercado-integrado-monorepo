// app/seu-caminho/page.tsx (Server Component)
import { Barcode, Network, RefreshCcwDot, Waypoints } from "lucide-react";
import ComponentComunicacao from "./components/comunicacao/ComponentComunicacao";
import ComponentProcessamentos from "./components/processamentos/ComponentProcessamentos";
import ComponentCentralNFCE from "./components/centralNFCE/ComponentCentralNFCE";
import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper";
import { fetchDadosCentralNFCE } from "./hooks/fetchCentralNFCE";
import ComponentEtiquetas from "./components/etiquetas/ComponentEtiquetas";

const PageProcessos = async () => {
  const dadosCentralNFCE = await fetchDadosCentralNFCE();
  
  const nestedTabItems = [
    {
      value: "centralNFCE",
      label: (
        <span className="flex items-center gap-2">
          <Network size={14} /> Central NFCE
        </span>
      ),
      content: <ComponentCentralNFCE  dados={dadosCentralNFCE}/>,
    },
    {
      value: "etiquetas",
      label: (
        <span className="flex items-center gap-2">
          <Barcode size={14} /> Etiquetas
        </span>
      ),
      content: <ComponentEtiquetas/>,
    },
    {
      value: "caixas",
      label: (
        <span className="flex items-center gap-2">
          <Waypoints size={14} /> Comunicação
        </span>
      ),
      content: <ComponentComunicacao />,
    },
    {
      value: "processamentos",
      label: (
        <span className="flex items-center gap-2">
          <RefreshCcwDot size={14} /> Processamentos
        </span>
      ),
      content: <ComponentProcessamentos />,
    }
  ];

  return (
    <div className="flex-1 h-full">
      <TabsWrapper items={nestedTabItems} />
    </div>
  );
};

export default PageProcessos;
