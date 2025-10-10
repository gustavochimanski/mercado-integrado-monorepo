import { Download } from "lucide-react";
import * as XLSX from "sheetjs-style";
import React from "react";

interface ExportButtonProProps {
  rows: any[];
  columns?: string[]; // agora é opcional
  children?: React.ReactNode;
}

export const ExportButtonPro: React.FC<ExportButtonProProps> = ({
  rows,
  columns,
  children,
}) => {
  const exportExcel = () => {
    // Se não passar columns, exporta todas as chaves do primeiro row
    const camposParaExportar =
      columns ?? (rows.length > 0 ? Object.keys(rows[0]) : []);

    const filteredRows = rows.map((row) => {
      const filtered: Record<string, any> = {};
      camposParaExportar.forEach((field) => {
        filtered[field] = row[field];
      });
      return filtered;
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Export");
    XLSX.writeFile(workbook, "export.xlsx");
  };

  return (
    <div className="w-full h-full">
      <button
        type="button"
        onClick={exportExcel}
        className="flex items-center gap-2 w-full h-full text-sm cursor-pointer"
      >
        <Download className="shrink-0" />
        <span className="w-full text-xs text-left">{children ?? "Excel"}</span>
      </button>
    </div>
  );
};
