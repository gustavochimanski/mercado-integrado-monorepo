import React, { useRef, useMemo } from "react";
import {
  DataGrid,
  GridColDef,
  DataGridProps,
  GridRowParams,
  GridRowSelectionModel,
  GridCellEditStopParams,
  GridRowModel,
  GridCellEditStopReasons,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

import { GridApi } from "@mui/x-data-grid";

export interface DataTableComponentProps
  extends Omit<DataGridProps, "rows" | "columns" | "localeText"> {
  rows?: any[];
  columns: GridColDef[];
  columnOrder?: string[];
  onRowClick?: (rowData: any) => void;
  onRowSelectionModelChange?: (ids: GridRowSelectionModel) => void;
  onRowEditConfirm?: (newRow: GridRowModel, foiComEnter: boolean) => void;
  apiRef?: React.MutableRefObject<GridApi | null>;
}


const defaultLocaleText: DataGridProps["localeText"] = {
  columnMenuLabel: "Menu da Coluna",
  columnMenuSortAsc: "Ordenar Crescente",
  columnMenuSortDesc: "Ordenar Decrescente",
  columnMenuFilter: "Filtrar",
  columnMenuHideColumn: "Ocultar Coluna",
  columnMenuShowColumns: "Mostrar Colunas",
  columnMenuManageColumns: "Definir Colunas",
  footerTotalRows: "Total de linhas:",
};

const DataTableComponentMui: React.FC<DataTableComponentProps> = ({
  rows,
  columns,
  onRowClick,
  onRowSelectionModelChange,
  onRowEditConfirm,
  apiRef,
  columnOrder,
  ...rest
}) => {
  const editReasonRef = useRef<GridCellEditStopReasons | null>(null);

  const handleRowClick = (params: GridRowParams) => {
    if (onRowClick) onRowClick(params.row);
  };

  const handleCellEditStop = (params: GridCellEditStopParams) => {
    editReasonRef.current = params.reason ?? null;

  };

  const handleProcessRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    const foiComEnter = editReasonRef.current === GridCellEditStopReasons.enterKeyDown;

    if (onRowEditConfirm) {
      onRowEditConfirm(newRow, foiComEnter);
    }

    return foiComEnter ? newRow : oldRow;
  };

  const orderedColumns = useMemo(() => {
    const enhanceColumn = (col: GridColDef): GridColDef => ({
      ...col,
      headerAlign: col.headerAlign ?? "center",
      align: col.align ?? "center",
      flex: col.flex ?? 1,
    });

    const finalColumns = columns.map(enhanceColumn);
    if (!columnOrder) return finalColumns;

    const map = new Map(finalColumns.map((col) => [col.field, col]));
    return columnOrder.map((field) => map.get(field)).filter(Boolean) as GridColDef[];
  }, [columns, columnOrder]);

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <DataGrid
        rows={rows}
        apiRef={apiRef}
        columns={orderedColumns}
        rowHeight={35}
        checkboxSelection
        disableRowSelectionOnClick
        editMode="cell"
        localeText={defaultLocaleText}
        onRowClick={handleRowClick}
        onRowSelectionModelChange={onRowSelectionModelChange}
        onCellEditStop={handleCellEditStop}
        processRowUpdate={handleProcessRowUpdate}
        paginationModel={{ pageSize: 20, page: 0 }}
        pageSizeOptions={[20]}
        sx={{
          flex: 1,
          minHeight: 0,
          border: "none",
          "--DataGrid-rowBorder": "none",
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--foreground))",

          "& .MuiDataGrid-columnHeaders": {
            color: "hsl(var(--muted-foreground))",
            borderBottom: "1px solid hsl(var(--border))",
          },
          "& .MuiDataGrid-columnSeparator": {
            color: "hsl(var(--border))",
            visibility: "visible",
            width: "10px",
            opacity: 0.2,
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "hsl(var(--muted))",
            fontWeight: 600,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
          },
          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: "hsl(var(--background))",
          },
          "& .MuiDataGrid-row:nth-of-type(even)": {
            backgroundColor: "hsl(var(--muted))",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "hsl(var(--input))",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "0.75rem",
            border: "none",
            color: "hsl(var(--inputValue))",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "hsl(var(--card))",
            borderTop: "1px solid hsl(var(--border))",
            color: "hsl(var(--muted-foreground))",
            fontSize: "0.75rem",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .cell-status-ativo": {
            color: "hsl(var(--chart-2))",
            fontWeight: 600,
          },
          "& .cell-status-inativo": {
            color: "hsl(var(--destructive))",
            fontWeight: 600,
          },
          "& .MuiTablePagination-root": {
            color: "hsl(var(--muted-foreground))",
            fontSize: "0.75rem",
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            color: "hsl(var(--muted-foreground))",
            fontSize: "0.75rem",
          },
          "& .MuiSelect-select": {
            color: "hsl(var(--foreground))",
            backgroundColor: "hsl(var(--card))",
          },
          "& .MuiSvgIcon-root": {
            color: "hsl(var(--foreground))",
          },
          "& .MuiCheckbox-root .MuiSvgIcon-root": {
            fontSize: "1rem",
          },
        }}
        {...rest}
      />
    </Paper>
  );
};

export default DataTableComponentMui;
