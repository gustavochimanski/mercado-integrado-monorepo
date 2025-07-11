// src/components/ComponentCardHeader.tsx
"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { CardHeader, CardTitle } from "@supervisor/components/ui/card";
import { Calendar } from "@supervisor/components/ui/calendar";
import { Button } from "@supervisor/components/ui/button";
import { CalendarIcon, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@supervisor/components/ui/popover";
import { Label } from "@supervisor/components/ui/label";
import { useIsMobile } from "@supervisor/hooks/use-mobile";
import { Input } from "@supervisor/components/ui/input";
import { TypeFiltroDashboard } from "../../types/typeDashboard";
import { useFiltroDashboard } from "../../hooks/useHeaderDashboard";
import { formatDisplayDate } from "@supervisor/utils/format/formatDate";

interface Props {
  initialPayload: TypeFiltroDashboard;
  onChangePayload: (p: TypeFiltroDashboard) => void;
}

export default function ComponentCardHeader({ initialPayload, onChangePayload }: Props) {
  const isMobile = useIsMobile();

  const {
    control,
    handleSubmit,
    parseInput,
    buildEmpresaValue,
  } = useFiltroDashboard(initialPayload, onChangePayload);

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader className={`flex flex-row justify-between p-2 pb-3 bg-primary gap-2 font-sans ${isMobile ? "rounded-t-none" : "rounded-t-[var(--radius)]"}`}>
        {!isMobile && <CardTitle className="text-white m-2">Dashboard</CardTitle>}

        <div className="grid grid-cols-2 md:flex md:flex-row md:flex-wrap gap-2  text-sm w-full md:justify-end">
          {/* Data Inicial */}
          <Controller
            name="dataInicial"
            control={control}
            render={({ field }) => (
              <div className="flex mt-auto text-center">
                <div className="flex items-center bg-border rounded-l h-7 text-xs font-semibold px-3 w-full md:w-20">
                  <Label className="pointer-events-none select-none">Data Inicial</Label>
                </div>
                <div className="flex gap-2">
                  {!isMobile && (
                    <Input
                      disabled
                      value={formatDisplayDate(field.value)}
                      onChange={(e) => {
                        const d = parseInput(e.target.value);
                        if (d) field.onChange(d);
                      }}
                      className="h-7 !bg-background !opacity-100 text-center rounded-l-none border-none shadow-none"
                      placeholder="DD/MM/AAAA"
                    />
                  )}
                  <Popover>
                    <PopoverTrigger asChild className="rounded-l-none md:rounded">
                      <Button variant="outline" className="h-7">
                        <CalendarIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar mode="single" selected={field.value} onSelect={(d) => d && field.onChange(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          />

          {/* Data Final */}
          <Controller
            name="dataFinal"
            control={control}
            render={({ field }) => (
              <div className="flex mt-auto text-center">
                <div className="flex items-center bg-border rounded-l h-7 text-xs font-semibold px-3 w-full md:w-20">
                  <Label className="pointer-events-none select-none">Data Final</Label>
                </div>
                <div className="flex items-center gap-2">
                  {!isMobile && (
                    <Input
                      disabled
                      value={formatDisplayDate(field.value)}
                      onChange={(e) => {
                        const d = parseInput(e.target.value);
                        if (d) field.onChange(d);
                      }}
                      className="h-7 !bg-background !opacity-100 text-center rounded-l-none border-none shadow-none"
                      placeholder="DD/MM/AAAA"
                    />
                  )}
                  <Popover>
                    <PopoverTrigger asChild className="rounded-l-none md:rounded">
                      <Button variant="outline" className="h-7">
                        <CalendarIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar mode="single" selected={field.value} onSelect={(d) => d && field.onChange(d)} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          />



        </div>
          {/* Botão Submit */}
          <Button type="submit" className="bg-background hover:bg-background/60">
            <Search className="w-4 text-primary" />
            <span className="text-primary">Buscar</span>
          </Button>
      </CardHeader>
    </form>
  );
}
