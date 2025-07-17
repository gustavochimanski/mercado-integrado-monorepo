"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@supervisor/components/ui/card";
import { Button } from "@supervisor/components/ui/button";
import DataTableComponentMui from "@supervisor/components/shared/table/mui-data-table";
import type { GridColDef } from "@mui/x-data-grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { useCategorias } from "@supervisor/hooks/routes/cadastros/useCategoriasDelivery";
import { ModalNovoProduto } from "@supervisor/components/routes/cadastros/ModalAddProduto";
import { useFetchCadProdDelivery, useMutateProduto } from "@supervisor/hooks/routes/cadastros/useQueryProduto";
import { CircleCheckIcon, CirclePlus, Trash2 } from "lucide-react";

interface Props {
  empresaId: number;
}

export const TableCadastroProdutos = ({ empresaId }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: resp,
    isLoading: prodLoading,
    isError: prodError,
  } = useFetchCadProdDelivery(empresaId, 1, 30);
  const produtos = resp?.data ?? [];

  const { data: categorias = [] } = useCategorias(empresaId);
  const { update: updateProduto } = useMutateProduto();

  const columns: GridColDef[] = [
    { field: "cod_barras", headerName: "Código de Barras", flex: 1 },
    { field: "descricao", headerName: "Descrição", flex: 2 },
    {
      field: "preco_venda",
      headerName: "Preço",
      flex: 1,
      type: "number",
      editable: true

    },
    {
      field: "custo",
      headerName: "Custo",
      flex: 1,
      type: "number",
    },
    {
      field: "label_categoria",
      headerName: "Categoria",
      flex: 2,
    },
  ];

  return (
    <div className="flex flex-col flex-1 h-full">
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto">
          {prodError ? (
            <div className="text-red-500 p-4">Erro ao carregar produtos. {prodError}</div>
          ) : (
            <DataTableComponentMui
              rows={produtos}
              columns={columns}
              loading={prodLoading}
              getRowId={(row) => row.cod_barras}
            />
          )}
        </CardContent>

      {/* Botão fora do Card, sempre abaixo */}
      <CardFooter className="flex justify-start gap-4">
        <Button onClick={() => setModalOpen(true)}>
          <CirclePlus/> Novo Produto
        </Button>
        <Button variant={"destructive"}>
          <Trash2/> Excluir Produto
        </Button>
      </CardFooter>

      <ModalNovoProduto
        open={modalOpen}
        onOpenChange={setModalOpen}
        empresaId={empresaId}
      />
    </div>
  );
};

export default TableCadastroProdutos;
