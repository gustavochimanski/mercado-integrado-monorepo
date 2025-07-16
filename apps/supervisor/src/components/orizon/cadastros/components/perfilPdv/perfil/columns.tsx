import { GridColDef } from "@mui/x-data-grid";
import EditButton from "@supervisor/components/shared/table/buttons/editButton";

export const getPerfilCaixaColumns = (
  setRowSelected: (row: any) => void,
  setModoEdicao: (ativo: boolean) => void
): GridColDef[] => [
  {
    field: 'id',
    headerName: 'ID',
    minWidth: 50,
    align: "center",
    headerAlign: 'center',
  },
  {
    field: 'descricao',
    headerName: 'Descrição',
    minWidth: 120,
    editable: true,
  },
  {
    field: 'edit',
    headerName: 'Editar',
    align: "center",
    headerAlign: "center",
    minWidth: 70,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <EditButton
        onClick={() => {
          setRowSelected(params.row);   // seleciona o perfil
          setModoEdicao(true);          // entra em modo edição
        }}
      />
    ),
  },
];
