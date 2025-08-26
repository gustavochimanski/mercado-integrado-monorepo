import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { Home, HomeIcon, Pencil, Plus, Settings, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../Shared/ui/dropdown-menu";
import { useState } from "react";
import { ModalNovoProduto } from "../modals/ModalAddProduto";
import { toast } from "sonner";
import { ConfirmDialog } from "@cardapio/components/Shared/ConfirmDialog";
import { useMutateVitrine } from "@cardapio/services/useQueryVitrine";

interface AdminVitrineOptionsProps {
  empresaId: number;
  codCategoria: number;
  vitrineId: number;
  isHome?: boolean; // <---- NOVO
}

const AdminVitrineOptions = ({
  empresaId,
  codCategoria,
  vitrineId,
  isHome = false, // default seguro
}: AdminVitrineOptionsProps) => {
  const { isAdmin } = useUserContext();

  const [openModalAddProduto, setOpenModalAddProduto] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const { remove, markHome } = useMutateVitrine();

  if (!isAdmin) return null;

  const handleDelete = () => {
    remove.mutate(vitrineId);
  };

  const handleToggleHome = () => {
    // Alterna o estado atual
    markHome.mutate({ id: vitrineId, is_home: !isHome });
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

          <DropdownMenuItem onSelect={handleToggleHome}>
            {isHome ? (
              <>
                <HomeIcon className="mr-2 h-4 w-4" />
                Remover da Home
              </>
            ) : (
              <>
                <Home className="mr-2 h-4 w-4" />
                Colocar na Home
              </>
            )}
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
        vitrineId={vitrineId}
      />

      <ConfirmDialog
        open={openConfirmDelete}
        onOpenChange={setOpenConfirmDelete}
        title="Excluir vitrine"
        description="Tem certeza que deseja excluir esta vitrine? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AdminVitrineOptions;
