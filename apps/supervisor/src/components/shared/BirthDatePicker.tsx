"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

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
import { cn } from "@supervisor/lib/utils";

type BirthDatePickerProps = {
  value: string; // formato: "YYYY-MM-DD" ou ""
  onChange: (dateString: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

/**
 * DatePicker específico para Data de Nascimento
 * - Aceita strings no formato "YYYY-MM-DD" (padrão de input[type="date"])
 * - Mostra calendário visual do Shadcn
 * - Compatível com o formato existente no ClienteTab
 */
export function BirthDatePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Selecione a data"
}: BirthDatePickerProps) {
  // Converter string "YYYY-MM-DD" para Date
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    const parsed = parse(value, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

  // Estado para controlar o mês exibido no calendário
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    dateValue || new Date(2000, 0, 1)
  );

  // Handler para quando uma data é selecionada no calendário
  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Converter Date para string "YYYY-MM-DD"
      const formatted = format(selectedDate, "yyyy-MM-dd");
      onChange(formatted);
    } else {
      onChange("");
    }
  };

  // Handler para mudança de ano
  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(parseInt(year));
    setCurrentMonth(newDate);
  };

  // Handler para navegação de meses
  const handleMonthChange = (direction: "prev" | "next") => {
    const newDate = new Date(currentMonth);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonth(newDate);
  };

  // Gerar array de anos (1900 até ano atual)
  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let year = currentYear; year >= 1900; year--) {
      yearList.push(year);
    }
    return yearList;
  }, []);

  // Array de meses
  const months = React.useMemo(() => [
    { value: 0, label: "Janeiro" },
    { value: 1, label: "Fevereiro" },
    { value: 2, label: "Março" },
    { value: 3, label: "Abril" },
    { value: 4, label: "Maio" },
    { value: 5, label: "Junho" },
    { value: 6, label: "Julho" },
    { value: 7, label: "Agosto" },
    { value: 8, label: "Setembro" },
    { value: 9, label: "Outubro" },
    { value: 10, label: "Novembro" },
    { value: 11, label: "Dezembro" },
  ], []);

  // Handler para mudança de mês
  const handleMonthSelectChange = (month: string) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(parseInt(month));
    setCurrentMonth(newDate);
  };

  // Formatar data para exibição (DD/MM/YYYY)
  const displayText = React.useMemo(() => {
    if (!dateValue) return placeholder;
    return format(dateValue, "dd/MM/yyyy", { locale: ptBR });
  }, [dateValue, placeholder]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal bg-white",
            !dateValue && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 justify-center">
        <div className="p-3">
          {/* Header customizado com navegação */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleMonthChange("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Select
                value={currentMonth.getMonth().toString()}
                onValueChange={handleMonthSelectChange}
              >
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currentMonth.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-[100px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleMonthChange("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendário */}
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            disabled={(date) =>
              date > new Date() || // Não permitir datas futuras
              date < new Date("1900-01-01") // Limite inferior razoável
            }
            initialFocus
            className="p-0"
            classNames={{
              caption: "hidden", // Esconder caption padrão, usamos nosso header customizado
              months: "flex flex-col",
              month: "space-y-3",
              table: "w-full border-collapse",
              head_row: "flex ml-2 gap-2",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex items-center justify-center",
              row: "flex w-full",
              cell: "text-center ml-2 text-sm p-0 relative flex items-center justify-center",
              day: "h-9 w-9 p-0 font-normal flex items-center justify-center",
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
