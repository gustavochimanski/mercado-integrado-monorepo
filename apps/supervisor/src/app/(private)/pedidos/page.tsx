import KanbanPedidos from "@supervisor/components/routes/pedidos/Kanban"
import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper"
import {  Kanban } from "lucide-react"


const PagePedidos = () => {

    const nestedTabItems = [
        {
            value: "kanban",
            label: (
                <span className="flex items-center gap-2">
                    <Kanban size={15} /> Kanban
                </span>
            ),
            content: <KanbanPedidos />
        },
    ]

    return(
      <div className="flex-1 h-full ">
        <TabsWrapper items={nestedTabItems}/>
      </div>
    )
}


export default PagePedidos