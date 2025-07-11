import { formatDateToYYYYMMDD } from "@supervisor/utils/format/formatDate";
import { zodResolver }          from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { filtroDashboardSchema, FormFiltro, TODAS_EMPRESAS } from "../schema/schemaFiltroDashboard";
import { TypeFiltroDashboard } from "../types/typeDashboard";
import { useToast } from "@supervisor/hooks/use-toast";

export function useFiltroDashboard(
  initialPayload: TypeFiltroDashboard,
  onChangePayload: (p: TypeFiltroDashboard) => void
) {
  const { toast } = useToast();

  // Cria e configura o form
  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
  } = useForm<FormFiltro>({
    defaultValues: {
      empresas:
        initialPayload.empresas.length === TODAS_EMPRESAS.length
          ? [...TODAS_EMPRESAS]
          : initialPayload.empresas,
      dataInicial: new Date(`${initialPayload.dataInicio}T00:00:00`),
      dataFinal:   new Date(`${initialPayload.dataFinal}T00:00:00`),
    },
    resolver: zodResolver(filtroDashboardSchema),
  });

  // Transforma string "DD/MM/YYYY" em Date
  const parseInput = (str: string): Date | null => {
    const [dd, mm, yyyy] = str.split("/");
    const d = new Date(+yyyy, +mm - 1, +dd);
    return isNaN(d.getTime()) ? null : d;
  };

  // Define o valor exibido no select de empresas
  const buildEmpresaValue = (emp: string[]) =>
    emp.length === TODAS_EMPRESAS.length ? "Todas" : emp[0] ?? "__vazio__";

  // Mostra toast de erro
  const showToast = (msg: string, title = "Erro") =>
    toast({ title, description: msg, variant: "destructive" });

  // Tratamento de erros de validação
  const onError = (errs: any) => {
    if (errs.dataFinal?.message) showToast(errs.dataFinal.message, "Erro de data");
    Object.values(errs)
      .filter((e: any) => e?.message && e?.path?.[0] !== "dataFinal")
      .forEach((e: any) => showToast(e.message, "Erro de validação"));
  };

  // Ao submeter, converte e dispara callback
  const onSubmit: SubmitHandler<FormFiltro> = (data) => {
    onChangePayload({
      empresas:   data.empresas,
      dataInicio: formatDateToYYYYMMDD(data.dataInicial),
      dataFinal:   formatDateToYYYYMMDD(data.dataFinal),
      situacao:   "N",
    });
  };

  return {
    control,
    handleSubmit: rhfHandleSubmit(onSubmit, onError),
    parseInput,
    buildEmpresaValue,
  };
}
