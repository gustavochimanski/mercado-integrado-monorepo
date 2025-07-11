import TabsWrapper from "@supervisor/components/shared/tabs/tabsWrapper"
import { BarChart,  Pencil } from "lucide-react"
import TabComponentConfigMetas from "./components/TabComponentConfigMetas"


const PageMetas = () => {

    const nestedTabItems = [
        {
            value: "dashboard",
            label: (
                <span className="flex items-center gap-2">
                    <BarChart size={15} /> Dashboard
                </span>
            ),
            Component: <div />
        },
        {
            value: "calendario",
            label: (
                <span className="flex items-center gap-2">
                    <Pencil size={15} /> Metas
                </span>
            ),
            Component: <TabComponentConfigMetas />

        },
    ]

    return(
      <div className="flex-1 h-full ">
        <TabsWrapper items={nestedTabItems}/>
      </div>
    )
}


export default PageMetas