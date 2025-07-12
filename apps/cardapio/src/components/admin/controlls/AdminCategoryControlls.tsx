"use client";

import { useState } from "react";
import { useUserContext } from "@cardapio/hooks/auth/userContext";


import { Tooltip, TooltipContent, TooltipTrigger } from "../../Shared/ui/tooltip";
import { Pencil, Plus, Settings } from "lucide-react";
import { Button } from "../../Shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../Shared/ui/dropdown-menu";
import { ModalAddCategoria } from "../modals/ModalAddCategoria";

const AdminCategoryControls = ({ parentSlug = null }: { parentSlug?: string | null }) => {
  const { isAdmin } = useUserContext();
  const [open, setOpen] = useState(false);

  if (!isAdmin) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Botão Adicionar Categoria */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Plus />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Adicionar Categoria</TooltipContent>
      </Tooltip>

      <ModalAddCategoria
            open={open}
            onOpenChange={setOpen}
            parentSlug={parentSlug}
        />

      {/* Botão Editar Categoria */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Pencil />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Editar Categoria</TooltipContent>
      </Tooltip>

      {/* Menu de ações */}
      <DropdownMenu>
        <Tooltip>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings />
            </Button>
          </DropdownMenuTrigger>
          <TooltipContent>Mais ações</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => { /* lógica editar */ }}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => { /* lógica excluir */ }}>
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AdminCategoryControls;
