// src/components/routes/cadastros/clientes/TableCadastroClientes.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@supervisor/components/ui/button";
import type { GridColDef} from "@mui/x-data-grid";
import { CirclePlus, Trash2, Edit } from "lucide-react";

import { useFetchClientes, useMutateCliente } from "@supervisor/services/useQueryCliente";

// ⬇️ Lazy-load do DataGrid wrapper (só no client)
const DataTableComponentMui = dynamic(
  () => import("@supervisor/components/shared/table/mui-data-table"),
  { ssr: false, loading: () => <div className="p-4 text-sm text-muted-foreground">Carregando tabela...</div> }
);

// ⬇️ Lazy-load dos modals (só abre quando clicar)
const ModalNovoCliente = dynamic(
  () => import("./ModalAddCliente").then(m => m.ModalNovoCliente),
  { ssr: false }
);

const ModalEditarCliente = dynamic(
  () => import("./ModalEditCliente").then(m => m.ModalEditarCliente),
  { ssr: false }
);

const ModalDeleteCliente = dynamic(
  () => import("./ModalDeleteCliente").then(m => m.ModalDeleteCliente),
  { ssr: false }
);


export const TableCadastroClientes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const { data: resp, isLoading: clientesLoading, isError: clientesError, error } =
    useFetchClientes();

  const { remove: deleteCliente } = useMutateCliente();

  // ✅ Memo nos dados
  const clientes = useMemo(() => resp?.data ?? [], [resp?.data]);

// helper para formatar data
const fmtDate = (dateString: string) => {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString('pt-BR');
  } catch {
    return "—";
  }
};

  // colunas
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "nome", headerName: "Nome", flex: 2, minWidth: 200 },
    { field: "cpf", headerName: "CPF", flex: 1.2, minWidth: 140 },
    { field: "telefone", headerName: "Telefone", flex: 1.2, minWidth: 140 },
    { field: "email", headerName: "Email", flex: 2, minWidth: 200 },
    {
      field: "data_nascimento",
      headerName: "Nascimento",
      flex: 1,
      minWidth: 120,
      valueFormatter: (value: any) => fmtDate(value),
    },
    {
      field: "ativo",
      headerName: "Ativo",
      flex: 0.8,
      minWidth: 100,
      type: "boolean",
      valueGetter: (value: any) => Boolean(value),
    },
    {
      field: "created_at",
      headerName: "Cadastrado",
      flex: 1,
      minWidth: 120,
      valueFormatter: (value: any) => fmtDate(value),
    },
           {
             field: "actions",
             headerName: "Ações",
             sortable: false,
             filterable: false,
             flex: 1,
             minWidth: 120,
             renderCell: (params) => {
               const cliente = params.row;
        return (
          <div className="flex justify-center items-center gap-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedClient(cliente);
                setEditModalOpen(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setSelectedClient(cliente);
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

  // ✅ Callbacks memorizados
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback((open: boolean) => setModalOpen(open), []);

  const closeEditModal = useCallback((open: boolean) => {
    setEditModalOpen(open);
    if (!open) {
      setSelectedClient(null);
    }
  }, []);

  const closeDeleteModal = useCallback((open: boolean) => {
    setDeleteModalOpen(open);
    if (!open) {
      setSelectedClient(null);
    }
  }, []);

  const handleDeleteClient = useCallback(async () => {
    if (!selectedClient?.id) return;
    
    try {
      await deleteCliente.mutateAsync(selectedClient.id);
      setDeleteModalOpen(false);
      setSelectedClient(null);
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
    }
  }, [selectedClient, deleteCliente]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={openModal}>
          <CirclePlus className="w-4 h-4 mr-1" />
          Novo Cliente
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        {clientesError ? (
          <p>Erro ao carregar clientes. {String((error as any)?.message ?? "")}</p>
        ) : (
          <DataTableComponentMui
            rows={clientes}
            columns={columns}
            getRowId={(row: any) => row.id}
            autoHeight={false}
            sx={{ height: '100%', width: '100%' }}
          />
        )}
      </div>

      <ModalNovoCliente open={modalOpen} onOpenChange={closeModal} />

      <ModalEditarCliente
        open={editModalOpen}
        onOpenChange={closeEditModal}
        cliente={selectedClient}
      />

      <ModalDeleteCliente
        open={deleteModalOpen}
        onOpenChange={closeDeleteModal}
        cliente={selectedClient}
        onConfirm={handleDeleteClient}
        isDeleting={deleteCliente.isPending}
      />
    </div>
  );
};

export default TableCadastroClientes;