import { formatDateToYYYYMMDD } from "@supervisor/utils/format/formatDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  filtroDashboardSchema,
  FormFiltro,
} from "../schema/schemaFiltroDashboard";
import { useToast } from "@supervisor/hooks/use-toast";
import { DashboardService, TypeDashboardRequest } from "@supervisor/api";
import { useState } from "react";
import { mensuraApi } from "@supervisor/api/MensuraApi";

export function useFiltroDashboard(
  initialPayload: Pick<TypeDashboardRequest, "dataInicio" | "dataFinal">,
  onSuccess: (result: any) => void
) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
  } = useForm<FormFiltro>({
    defaultValues: {
      dataInicial: new Date(`${initialPayload.dataInicio}T00:00:00`),
      dataFinal: new Date(`${initialPayload.dataFinal}T00:00:00`),
    },
    resolver: zodResolver(filtroDashboardSchema),
  });

  const parseInput = (str: string): Date | null => {
    const [dd, mm, yyyy] = str.split("/");
    const d = new Date(+yyyy, +mm - 1, +dd);
    return isNaN(d.getTime()) ? null : d;
  };

  const showToast = (msg: string, title = "Erro") =>
    toast({ title, description: msg, variant: "destructive" });

  const onError = (errs: any) => {
    if (errs.dataFinal?.message) showToast(errs.dataFinal.message, "Erro de data");
    Object.values(errs)
      .filter((e: any) => e?.message && e?.path?.[0] !== "dataFinal")
      .forEach((e: any) => showToast(e.message, "Erro de validação"));
  };

  const onSubmit: SubmitHandler<FormFiltro> = async (data) => {
    setIsLoading(true);

    const payload: TypeDashboardRequest = {
      empresas: [],
      dataInicio: formatDateToYYYYMMDD(data.dataInicial),
      dataFinal: formatDateToYYYYMMDD(data.dataFinal),
      situacao: "N",
    };

    const dashboardService: DashboardService = mensuraApi.dashboard;

    try {
      const result = await dashboardService.dashboardControllerBiDashboardPeriodoPost(payload);
      onSuccess(result);
    } catch (err: any) {
      showToast(err?.message ?? "Erro ao carregar dashboard");
    } finally {
      setIsLoading(false);
    }
  };''

  return {
    control,
    handleSubmit: rhfHandleSubmit(onSubmit, onError),
    parseInput,
    isLoading,
  };
}
