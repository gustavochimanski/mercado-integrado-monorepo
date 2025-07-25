import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { Pencil, Plus, Settings, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../Shared/ui/dropdown-menu";
import { useState } from "react";
import { ModalNovoProduto } from "../modals/ModalAddProduto";
import { toast } from "sonner";
import { useMutateSubcategoria } from "@cardapio/services/useQuerySecoesSub";
import { ConfirmDialog } from "@cardapio/components/Shared/ConfirmDialog";

interface AdminSecaoSubCategOptionsProps {
  empresaId: number;
  codCategoria: number;
  subcategoriaId: number;
}

const AdminSecaoSubCategOptions = ({
  empresaId,
  codCategoria,
  subcategoriaId,
}: AdminSecaoSubCategOptionsProps) => {
  const { isAdmin } = useUserContext();

  const [openModalAddProduto, setOpenModalAddProduto] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const { remove } = useMutateSubcategoria();

  if (!isAdmin) return null;

  const handleDelete = () => {
    remove.mutate(subcategoriaId);
  };

  return (
    <div className="ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Settings size={18} className="mx-4 h-full cursor-pointer" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setOpenModalAddProduto(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => toast.info("Edição ainda não implementada")}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar Seção
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => setOpenConfirmDelete(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalNovoProduto
        open={openModalAddProduto}
        onOpenChange={setOpenModalAddProduto}
        empresaId={empresaId}
        codCategoria={codCategoria}
        subcategoriaId={subcategoriaId}
      />

      <ConfirmDialog
        open={openConfirmDelete}
        onOpenChange={setOpenConfirmDelete}
        title="Excluir Subcategoria"
        description="Tem certeza que deseja excluir esta subcategoria? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminSecaoSubCategOptions;
