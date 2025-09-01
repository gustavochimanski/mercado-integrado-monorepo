import KanbanPedidos from "@supervisor/components/routes/pedidos/Kanban"
import Tabs from "@supervisor/components/shared/tabs/tabs"
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
            <Tabs
            items={nestedTabItems}
            containerClassName="w-full rounded-sm shadow h-full flex flex-col"
            triggerClassName="transition-colors"
            contentClassName=" rounded-sm flex-1 h-full overflow-hidden p-0"
            />
      </div>
    )
}


export default PagePedidos