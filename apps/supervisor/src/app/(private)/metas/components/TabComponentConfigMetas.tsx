"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@supervisor/components/ui/card";
import { Button } from "@supervisor/components/ui/button";
import { Calendar } from "@supervisor/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@supervisor/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@supervisor/components/ui/select";
import { FloatInput } from "@supervisor/components/shared/Inputs/floatInput";
import { usePostNewMeta } from "../hooks/useConfigMetas";
import { format } from "date-fns";
import { TipoMeta } from "../types/typeConfigMetas";
import { useToast } from "@supervisor/hooks/use-toast";
import { formatDateToYYYYMMDD } from "@supervisor/utils/format/formatDate";
import { CalendarIcon, CircleCheck } from "lucide-react";
import { cn } from "@supervisor/lib/utils";
import { Label } from "@supervisor/components/ui/label";

const EMPRESAS = [
  { label: "Empresa 01", value: "001" },
  { label: "Empresa 02", value: "002" },
  { label: "Empresa 03", value: "003" },
];

const TabComponentConfigMetas = () => {
  const form = useForm();
  const { toast } = useToast();
  const { mutateAsync: inserirNovaMeta } = usePostNewMeta();

  const handleSubmit = async (data: any) => {
    if (!data.empresa || !data.data || !data.valorMeta || !data.tipoMeta) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha todos os campos antes de salvar.",
      });
      return;
    }

    try {
      const response = await inserirNovaMeta({
        data: formatDateToYYYYMMDD(data.data),
        tipo: data.tipoMeta,
        valor: data.valorMeta,
        empresa: data.empresa,
      });

      toast({
        variant: "default",
        title: response?.mensagem,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar meta",
        description: error?.message || "Entre em contato com o Suporte! ",
      });
    }
  };

  return (
    <div className="flex-1 h-full">
      <CardHeader>
        <CardTitle>Configurações de Metas</CardTitle>
        <CardDescription>
          Defina o tipo, data, valor e empresa da meta.
        </CardDescription>
      </CardHeader>

      <CardContent className="mx-4 flex gap-4 flex-wrap">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <Label>Data da Meta</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] rounded text-left font-semibold",
                    !form.watch("data") && "text-muted-foreground"
                  )}
                >
                  {form.watch("data") ? format(form.watch("data"), "dd-MM-yyyy") : <span>Selecione uma data</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto " align="start">
                <Calendar
                  mode="single"
                  selected={form.watch("data")}
                  onSelect={(date) => form.setValue("data", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-52">
            <Label>Empresa</Label>
            <Select value={form.watch("empresa")} onValueChange={(val) => form.setValue("empresa", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {EMPRESAS.map((emp) => (
                  <SelectItem key={emp.value} value={emp.value}>
                    {emp.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tipo da Meta</Label>
            <Select value={form.watch("tipoMeta")} onValueChange={(val: TipoMeta) => form.setValue("tipoMeta", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metaVenda">Meta de Venda</SelectItem>
                <SelectItem value="metaMargem">Meta de Margem</SelectItem>
                <SelectItem value="limiteCompra">Limite de Compra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Valor</Label>
            <FloatInput
              type="text"
              value={form.watch("valorMeta")}
              onChangeValue={(val) => form.setValue("valorMeta", val)}
            />
          </div>

          <Button type="submit" className="mt-auto">
            <CircleCheck /> Salvar
          </Button>
        </form>
      </CardContent>
    </div>
  );
};

export default TabComponentConfigMetas;