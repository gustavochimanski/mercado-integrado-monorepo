// src/utils/dashboardMetaUtils.ts
import { TotaisPorEmpresaMeta } from "../types/typeMetas";

export const getCompanyMetaValue = (
  metas: TotaisPorEmpresaMeta[],
  codempresa: string,
  tipo: TotaisPorEmpresaMeta["tipo"]
): number => {
  return (
    metas.find(
      (m) => m.codempresa === codempresa && m.tipo === tipo
    )?.valorMeta ?? 0
  );
};
