import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { ArrowUpDown, Home, HomeIcon, Pencil, Plus, Settings, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../Shared/ui/dropdown-menu";
import { useState } from "react";
import { ModalNovoProduto } from "../modals/ModalAddProduto";
import { ModalEditVitrine } from "../modals/ModalEditVitrine";
import { ModalReordenarVitrines } from "../modals/ModalReordenarVitrines";
import { ConfirmDialog } from "@cardapio/components/Shared/ConfirmDialog";
import { useMutateVitrine } from "@cardapio/services/vitrine";
import { useLandingpageTrue } from "@cardapio/services/vitrine/utils";

interface AdminVitrineOptionsProps {
  empresaId: number;
  codCategoria: number | null;
  vitrineId: number;
  isHome?: boolean;
  titulo?: string;
  ordem?: number;
}

const AdminVitrineOptions = ({
  empresaId,
  codCategoria,
  vitrineId,
  isHome = false,
  titulo = "",
  ordem,
}: AdminVitrineOptionsProps) => {
  const { isAdmin } = useUserContext();
  const isLandingpage = useLandingpageTrue();

  const [openModalAddProduto, setOpenModalAddProduto] = useState(false);
  const [openModalEditVitrine, setOpenModalEditVitrine] = useState(false);
  const [openModalReorder, setOpenModalReorder] = useState(false);
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

          {!isLandingpage && (
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
          )}

          <DropdownMenuItem
            onSelect={() => setOpenModalEditVitrine(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar Seção
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setOpenModalReorder(true)}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Reordenar vitrines
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

      <ModalEditVitrine
        open={openModalEditVitrine}
        onOpenChange={setOpenModalEditVitrine}
        vitrineId={vitrineId}
        tituloInicial={titulo}
        codCategoriaInicial={codCategoria}
        isHomeInicial={isHome}
      />

      <ModalReordenarVitrines
        open={openModalReorder}
        onOpenChange={setOpenModalReorder}
        codCategoria={codCategoria}
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
