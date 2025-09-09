"use client";

import { useState, useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Pen, Trash2, Plus } from "lucide-react";
import { Button } from "@supervisor/components/ui/button";
import DataTableComponentMui from "@supervisor/components/shared/table/mui-data-table";
import ConfirmModal from "@supervisor/components/shared/modals/modalConfirm";
import { ParceiroCompletoOut, useMutateParceiro, useParceiros } from "@supervisor/services/useQueryParceiros";
import ParceiroBannersModal from "./ParceiroBannerModal";
import AdicionarParceiroModal from "./AdcionarParceiroModal";

export default function ParceirosTable() {
  const { data: parceiros = [], isLoading, refetch } = useParceiros();
  const { remove } = useMutateParceiro();

  const [selected, setSelected] = useState<ParceiroCompletoOut | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAddParceiro, seModalAddParceiro] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [parceiroToDelete, setParceiroToDelete] = useState<any | null>(null);


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
      { field: "nome", headerName: "Nome", flex: 3 },
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
        flex: 2,
        renderCell: (params) => {
          const parceiro = params.row;
          return (
            <div className="flex justify-center items-center gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelected(parceiro);
                  setModalOpen(true);
                }}
              >
                <Pen className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setParceiroToDelete(parceiro);
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
            seModalAddParceiro(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar Parceiro
        </Button>
      </div>

      {/* Container da tabela com scroll */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <p>Carregando parceiros...</p>
        ) : (
          <DataTableComponentMui
            rows={parceiros}
            columns={columns}
            getRowId={(row) => row.id}
            sx={{ height: "100%", width: "100%" }}
          />
        )}
      </div>

      <ParceiroBannersModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        parceiroId={selected?.id}
      />

      <AdicionarParceiroModal
        open={modalAddParceiro}
        onOpenChange={seModalAddParceiro}
        onSaved={() => refetch()}
      />


      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Remover Parceiro"
        description={`Tem certeza que deseja remover o parceiro "${parceiroToDelete?.nome}"?`}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (parceiroToDelete) handleDelete(parceiroToDelete.id);
          setParceiroToDelete(null);
        }}
        confirmLabel="Remover"
        cancelLabel="Cancelar"
      />
    </div>
  );
}
