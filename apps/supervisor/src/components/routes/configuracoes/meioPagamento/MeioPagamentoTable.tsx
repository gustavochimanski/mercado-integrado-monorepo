"use client";

import { useState, useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Pen, Trash2, Plus } from "lucide-react"; // Importa o ícone de adicionar
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
        headerAlign: "center",
        align: "center",
        renderCell: (params) => (
            <div className="w-full h-full flex items-center justify-center">
            <span
                className={`w-3 h-3 rounded-full ${params.value ? "bg-green-500" : "bg-red-500"}`}
            />
            </div>
        ),
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
<div className="flex flex-col h-full">
  {/* Botão de adicionar */}
  <div className="flex justify-end mb-4">
    <Button
      size="sm"
      onClick={() => {
        setSelected(null);
        setModalOpen(true);
      }}
    >
      <Plus className="w-4 h-4 mr-1" />
      Novo Meio de Pagamento
    </Button>
  </div>

  {/* Container da tabela com scroll */}
  <div className="flex-1 min-h-0">
    {isLoading ? (
      <p>Carregando meios de pagamento...</p>
    ) : (
      <DataTableComponentMui
        rows={meios}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight={false} // importante para respeitar altura do container
        sx={{ height: '100%', width: '100%' }}
      />
    )}
  </div>
</div>


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
