"use client";

import { useState, useMemo } from "react";
import { EmpresaMensura } from "@supervisor/types/empresas/TypeEmpresasMensura";
import { GridColDef } from "@mui/x-data-grid";
import { Pen, Trash2, Plus } from "lucide-react";
import { useEmpresas } from "@supervisor/services/global/useQueryEmpresasMensura";
import { Button } from "@supervisor/components/ui/button";
import DataTableComponentMui from "@supervisor/components/shared/table/mui-data-table";
import EmpresaModal from "./CadastroEmpresaModal";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { toastSucess, toastErro } from "@supervisor/lib/toast";
import ConfirmModal from "@supervisor/components/shared/modals/modalConfirm";

export default function EmpresasTable() {
  const { data: empresas = [], isLoading, refetch } = useEmpresas();
  const [selected, setSelected] = useState<EmpresaMensura | null>(null);
  const [open, setOpen] = useState(false);

  // Modal de confirmação
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState<EmpresaMensura | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await apiMensura.delete(`/api/mensura/empresas/${id}`);
      toastSucess("Empresa removida com sucesso!");
      refetch();
    } catch (err) {
      console.error(err);
      toastErro("Erro ao remover empresa");
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", flex: 1 },
      { field: "nome", headerName: "Nome", flex: 2 },
      { field: "cnpj", headerName: "CNPJ", flex: 2 },
      { field: "email", headerName: "Email", flex: 2 },
      {
        field: "actions",
        headerName: "Ações",
        sortable: false,
        filterable: false,
        flex: 1,
        renderCell: (params) => {
          const empresa = params.row as EmpresaMensura;
          return (
            <div className="flex justify-center items-center gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelected(empresa);
                  setOpen(true);
                }}
              >
                <Pen className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setEmpresaToDelete(empresa);
                  setDeleteModalOpen(true);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="flex flex-col h-full">
      {/* Botão de adicionar */}
      <div className="flex justify-end mb-4">
        <Button
          size="sm"
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar Empresa
        </Button>
      </div>

      {/* Container da tabela com scroll */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <p>Carregando empresas...</p>
        ) : (
          <DataTableComponentMui
            rows={empresas}
            columns={columns}
            getRowId={(row) => row.id}
            autoHeight={false} // importante para respeitar altura do container
            sx={{ height: "100%", width: "100%" }}
          />
        )}
      </div>

      <EmpresaModal open={open} onOpenChange={setOpen} empresa={selected} />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Remover Empresa"
        description={`Tem certeza que deseja remover a empresa "${empresaToDelete?.nome}"?`}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (empresaToDelete) handleDelete(empresaToDelete.id);
          setEmpresaToDelete(null);
        }}
        confirmLabel="Remover"
        cancelLabel="Cancelar"
      />
    </div>
  );
}
