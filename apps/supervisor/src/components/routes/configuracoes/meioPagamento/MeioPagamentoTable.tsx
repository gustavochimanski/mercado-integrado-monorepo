"use client";

import { useState, useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Pen, Trash2 } from "lucide-react";
import { Button } from "@supervisor/components/ui/button";
import DataTableComponentMui from "@supervisor/components/shared/table/mui-data-table";
import ConfirmModal from "@supervisor/components/shared/modals/modalConfirm";
import MeioPagamentoModal from "./MeioPagamentoModal";
import { MeioPagamento, useMeiosPagamento, useMutateMeioPagamento } from "@supervisor/services/useQueryMeioPagamento";

export default function MeiosPagamentoTable() {
  const { data: meios = [], isLoading, refetch } = useMeiosPagamento();
  const { remove } = useMutateMeioPagamento();

  const [selected, setSelected] = useState<MeioPagamento | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [meioToDelete, setMeioToDelete] = useState<MeioPagamento | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", flex: 1 },
      { field: "nome", headerName: "Nome", flex: 2 },
      { field: "tipo", headerName: "Tipo", flex: 2 },
      {
        field: "ativo",
        headerName: "Ativo",
        flex: 1,
        renderCell: (params) => (params.value ? "Sim" : "Não"),
      },
      {
        field: "actions",
        headerName: "Ações",
        sortable: false,
        filterable: false,
        flex: 1,
        renderCell: (params) => {
          const meio = params.row as MeioPagamento;
          return (
            <div className="flex justify-center items-center gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelected(meio);
                  setModalOpen(true);
                }}
              >
                <Pen className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setMeioToDelete(meio);
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
    <>
      {isLoading ? (
        <p>Carregando meios de pagamento...</p>
      ) : (
        <DataTableComponentMui
          rows={meios}
          columns={columns}
          getRowId={(row) => row.id}
        />
      )}

      <MeioPagamentoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        meioPagamento={selected}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Remover Meio de Pagamento"
        description={`Tem certeza que deseja remover o meio de pagamento "${meioToDelete?.nome}"?`}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (meioToDelete) handleDelete(meioToDelete.id);
          setMeioToDelete(null);
        }}
        confirmLabel="Remover"
        cancelLabel="Cancelar"
      />
    </>
  );
}
