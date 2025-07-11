// columns/caixasColumns.ts
import { GridColDef } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { Pencil } from "lucide-react";

export const getCaixasColumns = (
  setModalAberto: (aberto: boolean) => void
): GridColDef[] => [
  { field: 'id', headerName: 'ID', minWidth: 50, align: "center", headerAlign: 'center' },
  { field: 'descricao', headerName: 'Descrição', minWidth: 120, editable: true },
  {
    field: 'viewModal',
    headerName: 'Editar',
    align: "center",
    headerAlign: "center",
    minWidth: 70,
    sortable: false,
    filterable: false,
    renderCell: () => (
      <IconButton
        color="primary"
        onClick={() => setModalAberto(true)}
      >
        <Pencil size={15} />
      </IconButton>
    ),
  },
  { field: 'empresaId', headerName: 'Empresa', minWidth: 80, align: "center", headerAlign: 'center' },
  { field: 'ip', headerName: 'IP', minWidth: 130, align: "center", editable: true },
  { field: 'tipoSat', headerName: 'Sat', minWidth: 90, align: "center", headerAlign: 'center', editable: true },
  {
    field: 'status',
    headerName: 'Status',
    minWidth: 70,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const isAtivo = params.value === 'S';
      const color = isAtivo ? '#16a34a' : '#dc2626';

      return (
        <span
          style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: color,
          }}
          title={isAtivo ? 'Ativo' : 'Inativo'}
        />
      );
    },
  },
];
