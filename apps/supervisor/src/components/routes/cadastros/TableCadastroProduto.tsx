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
import { CircleCheckIcon, Trash2 } from "lucide-react";

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
      field: "imagem",
      headerName: "Imagem",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.value as string}
          alt={params.row.descricao}
          style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 4 }}
        />
      ),
    },
    {
      field: "preco_venda",
      headerName: "Preço",
      flex: 1,
      type: "number",
      valueFormatter: ({ value }) =>
        Number(value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
    },
    {
      field: "custo",
      headerName: "Custo",
      flex: 1,
      type: "number",
      valueFormatter: ({ value }) =>
        value != null
          ? Number(value).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          : "-",
    },
    {
      field: "label_categoria",
      headerName: "Categoria",
      flex: 2,
      renderCell: (params) => (
        <Select
          value={params.row.cod_categoria ?? ""}
          onChange={(e) => {
            const newCatId = Number(e.target.value);
            const formData = new FormData();
            formData.append("cod_categoria", String(newCatId));
            updateProduto.mutate({
              cod_barras: params.row.cod_barras,
              formData,
            });
          }}
          fullWidth
          disabled={updateProduto.isPending}
        >
          {categorias.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.label}
            </MenuItem>
          ))}
        </Select>
      ),
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
          <CircleCheckIcon/> Novo Produto
        </Button>
        <Button variant={"destructive"} onClick={() => setModalOpen(true)}>
          /<Trash2/> Excluir Produto
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
