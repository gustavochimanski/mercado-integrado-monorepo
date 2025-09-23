"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@supervisor/components/ui/card";
import { Button } from "@supervisor/components/ui/button";
import type { GridColDef} from "@mui/x-data-grid";
import { Trash2, Edit } from "lucide-react";

// Lazy-load do DataGrid wrapper (só no client)
const DataTableComponentMui = dynamic(
  () => import("@supervisor/components/shared/table/mui-data-table"),
  { ssr: false, loading: () => <div className="p-4 text-sm text-muted-foreground">Carregando tabela...</div> }
);


interface Props {
  empresaId: number;
}

export const TableCadastroClientes = ({ empresaId }: Props) => {
  const [selectedClientes, setSelectedClientes] = useState<number[]>([]);

  // TODO: Conectar com hook da API quando estiver disponível
  const clientes: any[] = []; // Array vazio até ter dados da API
  const isLoading = false;
  const hasError = false;

  // Helper para formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Helper para status
  const getStatusText = (ativo: boolean) => ativo ? "Ativo" : "Inativo";

  // Helper para formatar telefone
  const formatTelefone = (telefone: string) => {
    if (!telefone) return "—";
    return telefone;
  };

  // Colunas da tabela
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        flex: 0.5,
        minWidth: 80
      },
      {
        field: "nome",
        headerName: "Nome",
        flex: 2,
        minWidth: 200,
        editable: true,
      },
      {
        field: "cpf",
        headerName: "CPF",
        flex: 1.2,
        minWidth: 140
      },
      {
        field: "telefone",
        headerName: "Telefone",
        flex: 1.2,
        minWidth: 140,
        editable: true,
        valueFormatter: (value: any) => formatTelefone(value),
      },
      {
        field: "email",
        headerName: "Email",
        flex: 2,
        minWidth: 200,
        editable: true,
      },
      {
        field: "data_nascimento",
        headerName: "Nascimento",
        flex: 1,
        minWidth: 120,
        valueFormatter: (value: any) => formatDate(value),
      },
      {
        field: "ativo",
        headerName: "Status",
        flex: 1,
        minWidth: 100,
        type: "boolean",
        editable: true,
        valueGetter: (value: any, row: any) => Boolean(value ?? row?.ativo),
        cellClassName: (params) => {
          return params.row.ativo ? "cell-status-ativo" : "cell-status-inativo";
        },
      },
      {
        field: "created_at",
        headerName: "Cadastro",
        flex: 1,
        minWidth: 120,
        valueFormatter: (value: any) => formatDate(value),
      },
    ],
    []
  );

  // Callbacks memorizados
  const handleRowSelectionChange = useCallback((ids: any) => {
    setSelectedClientes(ids);
  }, []);

  const handleEditCliente = useCallback(() => {
    if (selectedClientes.length === 1) {
      // TODO: Implementar edição quando tiver endpoint
      console.log("Editar cliente:", selectedClientes[0]);
    }
  }, [selectedClientes]);

  const handleDeleteCliente = useCallback(() => {
    if (selectedClientes.length > 0) {
      // TODO: Implementar exclusão quando tiver endpoint
      console.log("Excluir clientes:", selectedClientes);
    }
  }, [selectedClientes]);


  const handleRowEdit = useCallback((newRow: any, wasEnterKey: boolean) => {
    // TODO: Implementar edição inline quando tiver endpoint de update
    console.log("Editando cliente:", newRow, "Com Enter:", wasEnterKey);
    return newRow;
  }, []);

  return (
    <div className="flex flex-col flex-1 h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Clientes do Delivery</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          {hasError ? (
            <div className="text-red-500 p-4">
              Erro ao carregar clientes.
            </div>
          ) : clientes.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <p className="text-lg font-medium">Nenhum cliente encontrado</p>
                <p className="text-sm mt-2">Os clientes aparecerão aqui quando conectado à API</p>
              </div>
            </div>
          ) : (
            <DataTableComponentMui
              rows={clientes}
              columns={columns}
              loading={isLoading}
              getRowId={(row: any) => row.id}
              density="compact"
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              scrollbarSize={8}
              onRowSelectionModelChange={handleRowSelectionChange}
              onRowEditConfirm={handleRowEdit}
              initialState={{
                pagination: { paginationModel: { pageSize: 30, page: 0 } },
              }}
              pageSizeOptions={[30, 50, 100]}
            />
          )}
        </CardContent>

        <CardFooter className="flex justify-start gap-4">
          <Button
            variant="outline"
            disabled={selectedClientes.length !== 1}
            onClick={handleEditCliente}
          >
            <Edit size={16} /> Editar Cliente
          </Button>
          <Button
            variant="destructive"
            disabled={selectedClientes.length === 0}
            onClick={handleDeleteCliente}
          >
            <Trash2 size={16} /> Excluir
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TableCadastroClientes;