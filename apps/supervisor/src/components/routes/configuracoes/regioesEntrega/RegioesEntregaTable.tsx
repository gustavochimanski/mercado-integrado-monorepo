"use client";

import { useState, useMemo } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Pen, Trash2, Plus } from "lucide-react";
import { Button } from "@supervisor/components/ui/button";
import DataTableComponentMui from "@supervisor/components/shared/table/mui-data-table";
import ConfirmModal from "@supervisor/components/shared/modals/modalConfirm";
import RegiaoEntregaModal from "./RegiaoEntregaModal";
import { RegiaoEntrega, useRegioesEntrega, useMutateRegiaoEntrega } from "@supervisor/services/useQueryRegioesEntrega";

// Componente de tabela de regiões de entrega
export default function RegioesEntregaTable() {  
  const empresaId = 1; 

  const { data: regioes = [], isLoading, refetch } = useRegioesEntrega(empresaId);
  const { remove } = useMutateRegiaoEntrega();

  const [selected, setSelected] = useState<RegiaoEntrega | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [regiaoToDelete, setRegiaoToDelete] = useState<RegiaoEntrega | null>(null);

  // Função para deletar uma região de entrega
  const handleDelete = async (id: number) => {
    try {
      await remove.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // Definição das colunas da tabela
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", flex: 1 },
      { field: "cep", headerName: "CEP", flex: 1 },
      { field: "cidade", headerName: "Cidade", flex: 2 },
      { field: "bairro", headerName: "Bairro", flex: 2 },
      { field: "uf", headerName: "UF", flex: 1 },
      {
        field: "taxa_entrega",
        headerName: "Taxa Entrega",
        flex: 1,
        renderCell: (params) => `R$ ${params.value}`,
      },
      { field: "raio_km", headerName: "Raio (km)", flex: 1 },
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

      // Coluna de ações (editar e deletar)
      {
        field: "actions",
        headerName: "Ações",
        sortable: false,
        filterable: false,
        flex: 1,
        renderCell: (params) => {
          const regiao = params.row as RegiaoEntrega;
          return (
            <div className="flex justify-center items-center gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelected(regiao);
                  setModalOpen(true);
                }}
              >
                <Pen className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setRegiaoToDelete(regiao);
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

  // Renderização do componente
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
            Nova Região de Entrega
          </Button>
        </div>

        {/* Tabela de regiões de entrega */}
        <div className="flex-1 min-h-0">
          {isLoading ? (
            <p>Carregando regiões de entrega...</p>
          ) : (
            <DataTableComponentMui
              rows={regioes}
              columns={columns}
              getRowId={(row) => row.id}
              autoHeight={false}
              sx={{ height: "100%", width: "100%" }}
            />
          )}
        </div>
      </div>
      {/* Modal de criação/edição de região de entrega */}
      <RegiaoEntregaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        regiaoEntrega={selected}
        empresaId={empresaId}
      />
      {/* Modal de confirmação para deletar região de entrega */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Remover Região de Entrega"
        description={`Tem certeza que deseja remover a região "${regiaoToDelete?.bairro} - ${regiaoToDelete?.cidade}"?`}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          if (regiaoToDelete) handleDelete(regiaoToDelete.id);
          setRegiaoToDelete(null);
        }}
        confirmLabel="Remover"
        cancelLabel="Cancelar"
      />
    </>
  );
}