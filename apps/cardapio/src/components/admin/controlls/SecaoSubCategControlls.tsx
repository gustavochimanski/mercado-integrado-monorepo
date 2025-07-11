import { useUserContext } from "@packs/auth";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Pencil, Plus, Settings } from "lucide-react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";


const AdminSecaoSubCategControlls = () => {

  const { isAdmin} = useUserContext();


    return(
        <div>
            {isAdmin && (
            <div className="flex items-center gap-2">
                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <Plus />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    Adicionar Produto
                </TooltipContent>
                </Tooltip>

                <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <Pencil />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    Editar Seção
                </TooltipContent>
                </Tooltip>

                {/* Menu de ações */}
                <DropdownMenu>
                <Tooltip>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Settings />
                    </Button>
                    </DropdownMenuTrigger>
                    <TooltipContent>
                    Mais ações
                    </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => {/* lógica editar */}}>
                    Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => {/* lógica excluir */}}>
                    Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            )}
        </div>
    )
}


export default AdminSecaoSubCategControlls