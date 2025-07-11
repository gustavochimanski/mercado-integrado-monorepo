// src/schema/filtroDashboardSchema.ts
import { z } from "zod";

// Lista fixa de empresas
export const TODAS_EMPRESAS = [
  "001","002","003","004","005","006","007","008","009","010","011","012","013","014"
] as const;

// Schema Zod para o formulário de filtro do dashboard
export const filtroDashboardSchema = z
  .object({
    empresas:    z.array(z.string()),
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
