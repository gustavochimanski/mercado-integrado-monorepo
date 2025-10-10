import { ViewButton } from "@supervisor/components/shared/table/buttons/viewButton";
import { GridColDef } from "@mui/x-data-grid";

export const nfceColumns = (
  handleOpenVisualizarModal?: (row: any) => void
): GridColDef[] => {
  const baseColumns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 70  },
    { field: "empresa", headerName: "Empresa", minWidth: 80, },
    { field: "pdv", headerName: "PDV", minWidth: 80 },
    { field: "dataMvto", headerName: "Data Mvto", minWidth: 150 },
    { field: "dataEmitido", headerName: "Data Emitido", minWidth: 160 },
    { field: "dataCancelado", headerName: "Data Cancelado", minWidth: 160 },
    { field: "cupom", headerName: "Cupom", minWidth: 80 },
    { field: "dcto", headerName: "Dcto", minWidth: 80 },
    { field: "serie", headerName: "Série", minWidth: 70 },
    { field: "cnpjCpf", headerName: "CNPJ/CPF", minWidth: 150 },
    { field: "chave", headerName: "Chave Dcto", minWidth: 200 },
    { field: "protocolo", headerName: "Protocolo", minWidth: 140 },
    { field: "protocoloCanc", headerName: "Protocolo Canc", minWidth: 140 },
    { field: "valor", headerName: "Valor Dcto", minWidth: 120, type: "number", editable: true },
    {
      field: "sit",
      headerName: "Status",
      minWidth: 65,
      
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        let color = "";
        let title = "";

        switch (value) {
          case "A":
            color = "#22c55e";
            title = "Autorizado";
            break;
          case "P":
            color = "#facc15";
            title = "Pendente";
            break;
          case "C":
            color = "#ef4444";
            title = "Cancelado";
            break;
          case "I":
            color = "#fb923c";
            title = "Inutilizado";
            break;
          default:
            color = "#9ca3af";
            title = "Desconhecido";
        }

        return (
          <span
            style={{
              display: "inline-block",
              minWidth: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: color,
            }}
            title={title}
          />
        );
      },
    },
    { field: "motivo", headerName: "Motivo", minWidth: 160 },
    { field: "supCanc", headerName: "Sup. Canc", minWidth: 90 },
    { field: "nomeSupCanc", headerName: "Sup. Canc", minWidth: 100 },
    {
      field: "viewModal",
      headerName: "Ver",
      align: "center",
      headerAlign: "center",
      minWidth: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ViewButton
          onClick={() => handleOpenVisualizarModal?.(params.row)}
        />
      ),
    }
    
  ];

  return baseColumns;
};


export const nfceColumnOrder: string[] = [
  "id",
  "viewModal",
  "empresa",
  "pdv",
  "serie",
  "cupom",
  "dcto",
  "valor",
  "sit",          // status com bolinha colorida
  "cnpjCpf",
  "dataMvto",
  "chave",
  "protocolo",
  "nomeSupCanc",
  "protocoloCanc",
  "dataEmitido",
  "dataCancelado",
  "supCanc",
  "motivo",
];
