// src/components/routes/cadastros/TableCadastroProdutos.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@supervisor/components/ui/card";
import { Button } from "@supervisor/components/ui/button";
import type { GridColDef} from "@mui/x-data-grid";
import { CirclePlus, Trash2 } from "lucide-react";

import { useFetchCadProdMensura } from "@supervisor/hooks/routes/cadastros/useQueryProduto";

// ⬇️ Lazy-load do DataGrid wrapper (só no client)
const DataTableComponentMui = dynamic(
  () => import("@supervisor/components/shared/table/mui-data-table"),
  { ssr: false, loading: () => <div className="p-4 text-sm text-muted-foreground">Carregando tabela...</div> }
);

// ⬇️ Lazy-load do modal (só abre quando clicar)
const ModalNovoProduto = dynamic(
  () => import("./ModalAddProduto").then(m => m.ModalNovoProduto),
  { ssr: false }
);

interface Props {
  empresaId: number;
}

export const TableCadastroProdutos = ({ empresaId }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  // ⚠️ Se seu hook aceitar opções, ajuste nele:
  // refetchOnWindowFocus: false, staleTime: 5*60_000, keepPreviousData: true
  const { data: resp, isLoading: prodLoading, isError: prodError, error } =
    useFetchCadProdMensura(empresaId, 1, 30);

  // ✅ Memo nos dados
  const produtos = useMemo(() => resp?.data ?? [], [resp?.data]);


// helper simples
const fmtBRL = (v: unknown) =>
  v === null || v === undefined || v === "" ? "—" : `R$ ${v}`;

// colunas
const columns: GridColDef[] = useMemo(
  () => [
    { field: "cod_barras", headerName: "Código de Barras", flex: 1, minWidth: 160 },
    { field: "descricao", headerName: "Descrição", flex: 2, minWidth: 220 },

    {
      field: "custo",
      headerName: "Custo",
      flex: 1,
      minWidth: 120,
      valueFormatter: (value: any) => fmtBRL(value),
    },
    {
      field: "preco_venda",
      headerName: "Preço",
      flex: 1,
      minWidth: 120,
      editable: true,
      valueFormatter: (value: any) => fmtBRL(value),
    },
    {
      field: "preco_delivery",
      headerName: "Preço Delivery",
      flex: 1,
      minWidth: 120,
      editable: true,
      valueFormatter: (value: any) => fmtBRL(value),
    },
    {
      field: "label_categoria",
      headerName: "Categoria",
      flex: 1.5,
      minWidth: 160,
    },
    {
      field: "exibir_delivery",
      headerName: "Delivery",
      flex: 0.8,
      minWidth: 120,
      type: "boolean",
      valueGetter: (value: any, row: any) => Boolean(value ?? row?.exibir_delivery),
    },
  ],
  []
);



  // ✅ Callbacks memorizados
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback((open: boolean) => setModalOpen(open), []);

  return (
    <div className="flex flex-col flex-1 h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          {prodError ? (
            <div className="text-red-500 p-4">
              Erro ao carregar produtos. {String((error as any)?.message ?? "")}
            </div>
          ) : (
            <DataTableComponentMui
              rows={produtos}
              columns={columns}
              loading={prodLoading}
              // ⚙️ Ajustes de performance para MUI DataGrid (seu wrapper deve repassar)
              getRowId={(row: any) => row.cod_barras}
              density="compact"
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              scrollbarSize={8}
              initialState={{
                pagination: { paginationModel: { pageSize: 30, page: 0 } },
              }}
              pageSizeOptions={[30, 50, 100]}
            />
          )}
        </CardContent>

        <CardFooter className="flex justify-start gap-4">
          <Button onClick={openModal}>
            <CirclePlus /> Novo Produto
          </Button>
          <Button variant="destructive" disabled>
            <Trash2 /> Excluir Produto
          </Button>
        </CardFooter>
      </Card>

      <ModalNovoProduto open={modalOpen} onOpenChange={closeModal} empresaId={empresaId} />
    </div>
  );
};

export default TableCadastroProdutos;
