// columns/gruposColumns.ts
import { GridColDef } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";

export const getColumnsUsuarios = (
  onEditar: (id: number) => void,
  onExcluir: (id: number) => void,
  setEditModel?: (usuario: any) => void
): GridColDef[] => [
  {
    field: "id",
    headerName: "ID",
    type: "number",
    minWidth: 80,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "nome",
    headerName: "Nome",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "empresaId",
    headerName: "Empresa ID",
    type: "number",
    minWidth: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "perfilsUsuario",
    headerName: "Perfis",
    minWidth: 200,
    flex: 1,
    renderCell: (params) => {
      const perfis = params.row.perfilsUsuario || [];
      if (perfis.length === 0) return "-";
      return perfis.map((perfil: any) => perfil.nome ?? "Sem Nome").join(", ");
    },
  },
  {
    field: "editar",
    headerName: "Editar",
    minWidth: 80,
    align: "center",
    headerAlign: "center",
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <IconButton
        color="primary"
        onClick={() => {
          onEditar(params.row.id);
          setEditModel?.(params.row); // seta o model no pai
        }}
      >
        <Pencil size={18} />
      </IconButton>
    ),
  },
  {
    field: "excluir",
    headerName: "Excluir",
    minWidth: 80,
    align: "center",
    headerAlign: "center",
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <IconButton
        color="error"
        onClick={() => onExcluir(params.row.id)}
      >
        <Trash2 size={18} />
      </IconButton>
    ),
  },
];



export const getPermissaoUsuarioColumns = (
  onExcluir: (id: number) => void
): GridColDef[] => [
  {
    field: "id",
    headerName: "ID",
    type: "number",
    minWidth: 100,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "nome",
    headerName: "Nome da Permissão",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "excluir",
    headerName: "Excluir",
    minWidth: 80,
    align: "center",
    headerAlign: "center",
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <IconButton color="error" onClick={() => onExcluir(params.row.id)}>
        <Trash2 size={18} />
      </IconButton>
    ),
  },
];
