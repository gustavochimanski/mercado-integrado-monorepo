"use client";

import { useState, useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Pen, Trash2, Plus } from "lucide-react";
import { Button } from "@supervisor/components/ui/button";
import DataTableComponentMui from "@supervisor/components/shared/table/mui-data-table";
import ConfirmModal from "@supervisor/components/shared/modals/modalConfirm";
import { useMutateCupom, useCupons, Cupom } from "@supervisor/services/useQueryCupons";
import AdicionarCupomModal from "./AdicionarCupomModal";
import EditarCupomModal from "./EditarCupomModal";

export default function TableCupons() {
  const { data: cupons = [], isLoading, refetch } = useCupons();
  const { remove } = useMutateCupom();

  const [selectedCupom, setSelectedCupom] = useState<Cupom | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cupomToDelete, setCupomToDelete] = useState<Cupom | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: GridColDef[] = useMemo(() => [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "codigo", headerName: "Código", flex: 2 },
    { field: "descricao", headerName: "Descrição", flex: 3 },
    { field: "ativo", headerName: "Ativo", flex: 1, headerAlign: "center", align: "center",
      renderCell: (params) => (
        <div className="w-full h-full flex items-center justify-center">
          <span className={`w-3 h-3 rounded-full ${params.value ? "bg-green-500" : "bg-red-500"}`} />
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      flex: 2,
      renderCell: (params) => {
        const cupom = params.row as Cupom;
        return (
          <div className="flex justify-center items-center gap-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCupom(cupom);
                setEditModalOpen(true);
              }}
            >
              <Pen className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setCupomToDelete(cupom);
                setDeleteModalOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ], []);

  return (
    <div className="flex flex-col h-full">
      {/* Botão de adicionar */}
      <div className="flex justify-end mb-4">
        <Button
          size="sm"
          onClick={() => {
            setSelectedCupom(null);
            setAddModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar Cupom
        </Button>
      </div>

      {/* Container da tabela */}
      <div className="flex-1 min-h-0">
        {isLoading ? <p>Carregando cupons...</p> : (
          <DataTableComponentMui
            rows={cupons}
            columns={columns}
            getRowId={(row) => row.id}
            sx={{ height: "100%", width: "100%" }}
          />
        )}
      </div>

      {/* Modais */}
      <AdicionarCupomModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSaved={refetch}
      />

      {selectedCupom && (
        <EditarCupomModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          cupom={selectedCupom}
          onSaved={refetch}
        />
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Remover Cupom"
        description={`Tem certeza que deseja remover o cupom "${cupomToDelete?.codigo}"?`}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (cupomToDelete) handleDelete(cupomToDelete.id);
          setCupomToDelete(null);
        }}
        confirmLabel="Remover"
        cancelLabel="Cancelar"
      />
    </div>
  );
}
