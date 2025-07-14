
import { Button } from "@cardapio/components/Shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@cardapio/components/Shared/ui/dropdown-menu";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { CircleArrowLeft, CircleArrowRight, MoreVertical, Pencil, Trash2 } from "lucide-react";

const CategoryOptions = () => {
  const { isAdmin } = useUserContext();


    return(
        <div>
            {isAdmin && (
                <div className="absolute top-1 right-1 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 p-0 text-muted-foreground hover:text-foreground"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-sm">
                    <DropdownMenuItem onClick={() => alert("Editar categoria")}>
                        <Pencil/> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => alert("Remover categoria")}>
                        <Trash2/> Remover
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => alert("Remover categoria")}>
                        <CircleArrowRight/> Mover para Direita
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => alert("Remover categoria")}>
                        <CircleArrowLeft/> Mover para Esquerda
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            )}
        </div>
    )
}


export default CategoryOptions