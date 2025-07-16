import { useUserContext } from "@cardapio/hooks/auth/userContext";

import { Pencil, Plus, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../Shared/ui/dropdown-menu";
import { useState } from "react";
import { ModalNovoProduto } from "../modals/ModalAddProduto";

interface AdminSecaoSubCategOptionsProps {
  empresaId: number;
  codCategoria: number;
  subcategoriaId: number
}

const AdminSecaoSubCategOptions = ({ empresaId, codCategoria, subcategoriaId }: AdminSecaoSubCategOptionsProps) => {
  const { isAdmin } = useUserContext();
  const [openModalAddProduto, setOpenModalAddProduto] = useState(false);

  if (!isAdmin) return null;

  return (
    <div className="ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Settings size={18} className="mx-4 mt-1 h-full cursor-pointer" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setOpenModalAddProduto(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar Seção
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalNovoProduto
        open={openModalAddProduto}
        onOpenChange={setOpenModalAddProduto}
        empresaId={empresaId}
        codCategoria={codCategoria}     // ✅ agora envia também
        subcategoriaId={subcategoriaId}
      />
    </div>
  );
};

export default AdminSecaoSubCategOptions;
