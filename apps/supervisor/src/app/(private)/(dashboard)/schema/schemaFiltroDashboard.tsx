// src/schema/filtroDashboardSchema.ts
import { z } from "zod";

// Schema Zod para o formulário de filtro do dashboard
export const filtroDashboardSchema = z
  .object({
    dataInicial: z.date(),
    dataFinal:   z.date(),
  })
  .refine(
    (vals) => vals.dataFinal >= vals.dataInicial,
    {
      path: ["dataFinal"],
      message: "Data final não pode ser anterior à inicial",
    }
  );

// Tipo TypeScript inferido a partir do schema
export type FormFiltro = z.infer<typeof filtroDashboardSchema>;
