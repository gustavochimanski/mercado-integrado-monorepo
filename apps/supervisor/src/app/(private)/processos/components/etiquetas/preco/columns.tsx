// columns-etq-preco.ts
import { Button } from "@supervisor/components/ui/button";
import { Delete, Trash2 } from "lucide-react";

export const columnsEtqPreco = (removerEtiqueta: (id: number) => void) => [
  { field: "codigo", headerName: "Código", width: 150 },
  { field: "descricao", headerName: "Descrição", width: 200 },
  { field: "valor", headerName: "Valor", width: 100 },
  { field: "quantidade", headerName: "Qtd", width: 100 },
  {
    field: "remover",
    headerName: "Excluir",
    renderCell: (params: any) => (
      <Button
        className="hover:text-red-600"
        variant="ghost"
        size="sm"
        onClick={() => removerEtiqueta(params.row.id)}
      >
        <Trash2/>
      </Button>
    ),
  },
];
