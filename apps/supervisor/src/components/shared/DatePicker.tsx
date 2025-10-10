"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@supervisor/components/ui/button";
import { Calendar } from "@supervisor/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@supervisor/components/ui/popover";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@supervisor/components/ui/tooltip";

type DatePickerProps = {
  date: Date;
  onChange: (date: Date) => void;
};

export function DatePicker({ date, onChange }: DatePickerProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="w-[220px] justify-start text-left text-background font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, "dd 'de' MMMM yyyy", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && onChange(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clique para escolher a data dos pedidos</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
