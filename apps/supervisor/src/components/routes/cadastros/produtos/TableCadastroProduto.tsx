// src/components/routes/cadastros/TableCadastroProdutos.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@supervisor/components/ui/card";
import { Button } from "@supervisor/components/ui/button";
import type { GridColDef} from "@mui/x-data-grid";
import { CirclePlus, Trash2, Edit } from "lucide-react";

import { useFetchCadProdMensura, useMutateProduto } from "@supervisor/services/useQueryProduto";

// ⬇️ Lazy-load do DataGrid wrapper (só no client)
const DataTableComponentMui = dynamic(
  () => import("@supervisor/components/shared/table/mui-data-table"),
  { ssr: false, loading: () => <div className="p-4 text-sm text-muted-foreground">Carregando tabela...</div> }
);

// ⬇️ Lazy-load dos modals (só abre quando clicar)
const ModalNovoProduto = dynamic(
  () => import("./ModalAddProduto").then(m => m.ModalNovoProduto),
  { ssr: false }
);

const ModalEditarProduto = dynamic(
  () => import("./ModalEditProduto").then(m => m.ModalEditarProduto),
  { ssr: false }
);

const ModalDeleteProduto = dynamic(
  () => import("./ModalDeleteProduto").then(m => m.ModalDeleteProduto),
  { ssr: false }
);

interface Props {
  empresaId: number;
}

export const TableCadastroProdutos = ({ empresaId }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

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
      valueFormatter: (value: any) => fmtBRL(value),
    },
    {
      field: "preco_delivery",
      headerName: "Preço Delivery",
      flex: 1,
      minWidth: 120,
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
    {
      field: "actions",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const produto = params.row;
        return (
          <div className="flex justify-center items-center gap-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedProduct(produto);
                setEditModalOpen(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setSelectedProduct(produto);
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
      setSelectedProduct(null);
    }
  }, []);

  const closeDeleteModal = useCallback((open: boolean) => {
    setDeleteModalOpen(open);
    if (!open) {
      setSelectedProduct(null);
    }
  }, []);

  const handleDeleteProduct = useCallback(async () => {
    if (!selectedProduct?.cod_barras) return;
    
    try {
      // TODO: Implementar quando tiver API de delete
      console.log("Excluir produto:", selectedProduct.cod_barras);
      // await deleteProduct.mutateAsync(selectedProduct.cod_barras);
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  }, [selectedProduct]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4">
        <Button size="sm" onClick={openModal}>
          <CirclePlus className="w-4 h-4 mr-1" />
          Novo Produto
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        {prodError ? (
          <p>Erro ao carregar produtos. {String((error as any)?.message ?? "")}</p>
        ) : (
          <DataTableComponentMui
            rows={produtos}
            columns={columns}
            getRowId={(row: any) => row.id || row.cod_barras}
            autoHeight={false}
            sx={{ height: '100%', width: '100%' }}
          />
        )}
      </div>

      <ModalNovoProduto open={modalOpen} onOpenChange={closeModal} empresaId={empresaId} />

      <ModalEditarProduto
        open={editModalOpen}
        onOpenChange={closeEditModal}
        produto={selectedProduct}
        empresaId={empresaId}
      />

      <ModalDeleteProduto
        open={deleteModalOpen}
        onOpenChange={closeDeleteModal}
        produto={selectedProduct}
        onConfirm={handleDeleteProduct}
        isDeleting={false} // TODO: Implementar quando tiver API
      />
    </div>
  );
};

export default TableCadastroProdutos;
