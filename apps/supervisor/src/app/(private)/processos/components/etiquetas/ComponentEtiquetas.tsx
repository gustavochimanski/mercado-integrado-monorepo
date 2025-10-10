import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper"
import { Barcode, IdCard, User } from "lucide-react"
import ComponentEtiquetasUsuarios from "./usuario/ComponentEtiquetasUsuarios"
import ComponentEtiquetasPreco from "./preco/ComponentEtiquetasPreco"


const ComponentEtiquetas = () => {
    const nestedTabItems = [
      {
        value: "etiquetasUsuarios",
        label: (
          <span className="flex items-center gap-2">
            <Barcode size={14} /> Preço
          </span>
        ),
        content: <ComponentEtiquetasPreco/>,
      },
      {
        value: "etiquetasPreco",
        label: (
          <span className="flex items-center gap-2">
            <IdCard size={15} /> Supervisor
          </span>
        ),
        content: <ComponentEtiquetasUsuarios/>,
      },
    ]
    return(
        <div className="flex 1 h-full">
            <TabsWrapper items={nestedTabItems}/>
        </div>
    )
}

export default ComponentEtiquetas