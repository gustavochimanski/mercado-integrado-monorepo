"use client";

import { useMemo, useState } from "react";
import { EmpresaMensura } from "@supervisor/types/empresas/TypeEmpresasMensura";
import { GridColDef } from "@mui/x-data-grid";
import { Pen, Trash2, Plus,  Eye } from "lucide-react";
import { useDeleteEmpresa, useEmpresas } from "@supervisor/services/useQueryEmpresasMensura";
import { Button } from "@supervisor/components/ui/button";
import DataTableComponentMui from "@supervisor/components/shared/table/mui-data-table";
import ConfirmModal from "@supervisor/components/shared/modals/modalConfirm";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { useToast } from "@supervisor/hooks/use-toast";
import EditEmpresaModal from "./EditEmpresaModal";
import AddEmpresaModal from "./AddEmpresaModal";

interface EmpresasTableProps {
  selectedEmpresa: EmpresaMensura | null;
  onSelectEmpresa: (empresa: EmpresaMensura | null) => void;
}

export default function EmpresasTable({ selectedEmpresa, onSelectEmpresa }: EmpresasTableProps) {
  const { data: empresas = [], isLoading, refetch } = useEmpresas();
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [empresaToEdit, setEmpresaToEdit] = useState<EmpresaMensura | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [empresaToDelete, setEmpresaToDelete] = useState<EmpresaMensura | null>(null);
  const toast = useToast();

  const { mutate: deleteEmpresa } = useDeleteEmpresa(onSelectEmpresa, selectedEmpresa)

  const handleDelete = (id: number) => {
    deleteEmpresa(id)
  }

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
        flex: 2,
        renderCell: (params) => {
          const empresa = params.row as EmpresaMensura;
          return (
            <div className="flex justify-center items-center gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectEmpresa(empresa)}
              >
                <Eye className="w-4 h-4" /> 
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEmpresaToEdit(empresa);
                  setEditOpen(true);
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
    [onSelectEmpresa]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Botão de adicionar empresa */}
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Adicionar Empresa
        </Button>
      </div>

      {/* Tabela */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <p>Carregando empresas...</p>
        ) : (
          <DataTableComponentMui
            rows={empresas}
            columns={columns}
            getRowId={(row) => row.id}
            sx={{ height: "100%", width: "100%" }}
            getRowClassName={(params) => (params.row.id === selectedEmpresa?.id ? "bg-gray-100" : "")}
          />
        )}
      </div>

      {/* Modal de edição */}
      {empresaToEdit && (
        <EditEmpresaModal
          open={editOpen}
          onOpenChange={setEditOpen}
          empresa={empresaToEdit}
          onSuccess={() => {
            refetch();
            setEmpresaToEdit(null);
          }}
        />
      )}

      {/* Modal de adição */}
      <AddEmpresaModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSuccess={() => refetch()}
      />

      {/* Modal de exclusão */}
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
