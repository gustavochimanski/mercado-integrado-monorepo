"use client";

import { useState, useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Pen, Trash2, Plus } from "lucide-react";
import { Button } from "@supervisor/components/ui/button";
import DataTableComponentMui from "@supervisor/components/shared/table/mui-data-table";
import ConfirmModal from "@supervisor/components/shared/modals/modalConfirm";
import EntregadorModal from "./EntregadorModal";
import { Entregador, useEntregadores, useMutateEntregador } from "@supervisor/services/useQueryEntregadores";

export default function EntregadoresTable() {
  const { data: entregadores = [], isLoading, refetch } = useEntregadores();
  const { remove } = useMutateEntregador();

  const [selected, setSelected] = useState<Entregador | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entregadorToDelete, setEntregadorToDelete] = useState<Entregador | null>(null);

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
      { field: "telefone", headerName: "Telefone", flex: 2 },
      { field: "documento", headerName: "Documento", flex: 2 },
      { field: "veiculo_tipo", headerName: "Veículo", flex: 1 },
      { field: "placa", headerName: "Placa", flex: 1 },
      { field: "acrescimo_taxa", headerName: "Acréscimo Taxa", flex: 1 },
      {
        field: "actions",
        headerName: "Ações",
        sortable: false,
        filterable: false,
        flex: 1,
        renderCell: (params) => {
          const entregador = params.row as Entregador;
          return (
            <div className="flex justify-center items-center gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelected(entregador);
                  setModalOpen(true);
                }}
              >
                <Pen className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setEntregadorToDelete(entregador);
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
        <div className="flex justify-end mb-4">
          <Button
            size="sm"
            onClick={() => {
              setSelected(null);
              setModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Novo Entregador
          </Button>
        </div>

        <div className="flex-1 min-h-0">
          {isLoading ? (
            <p>Carregando entregadores...</p>
          ) : (
            <DataTableComponentMui
              rows={entregadores}
              columns={columns}
              getRowId={(row) => row.id}
              sx={{ height: "100%", width: "100%" }}
            />
          )}
        </div>
      </div>

      <EntregadorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        entregador={selected}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Remover Entregador"
        description={`Tem certeza que deseja remover o entregador "${entregadorToDelete?.nome}"?`}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (entregadorToDelete) handleDelete(entregadorToDelete.id);
          setEntregadorToDelete(null);
        }}
        confirmLabel="Remover"
        cancelLabel="Cancelar"
      />
    </>
  );
}
