"use client";

import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select";
import { Badge } from "@supervisor/components/ui/badge";

interface CardapioTemaSelectProps {
  control: any;
  name: string;
}

const coresDisponiveis = [
  { value: "oklch(0.49 0.22 264)", label: "Azul", color: "oklch(0.49 0.22 264)", textColor: "oklch(0.97 0.01 255)" },
  { value: "oklch(0.71 0.13 215)", label: "Ciano", color: "oklch(0.71 0.13 215)", textColor: "oklch(0.98 0.02 201)" },
  { value: "oklch(0.68 0.15 237)", label: "Sky", color: "oklch(0.68 0.15 237)", textColor: "oklch(0.98 0.01 237)" },
  { value: "oklch(0.40 0.18 277)", label: "Indigo", color: "oklch(0.40 0.18 277)", textColor: "oklch(0.96 0.02 272)" },
  { value: "oklch(0.61 0.22 293)", label: "Violet", color: "oklch(0.61 0.22 293)", textColor: "oklch(0.97 0.02 294)" },
  { value: "oklch(0.56 0.25 302)", label: "Roxo", color: "oklch(0.56 0.25 302)", textColor: "oklch(0.97 0.02 294)" },
  { value: "oklch(0.67 0.26 322)", label: "Fuchsia", color: "oklch(0.67 0.26 322)", textColor: "oklch(0.98 0.02 320)" },
  { value: "oklch(0.66 0.21 354)", label: "Pink", color: "oklch(0.66 0.21 354)", textColor: "oklch(0.97 0.01 343)" },
  { value: "oklch(0.65 0.22 16))", label: "Rose", color: "oklch(0.65 0.22 16)", textColor: "oklch(0.97 0.02 12)" },
  { value: "oklch(0.70 0.19 48)", label: "Laranja", color: "oklch(0.70 0.19 48)", textColor: "oklch(0.98 0.02 74)" },
  { value: "oklch(0.64 0.21 25)", label: "Vermelho", color: "oklch(0.64 0.21 25)", textColor: "oklch(0.97 0.01 17)" },
  { value: "oklch(0.80 0.18 152)", label: "Verde", color: "oklch(0.80 0.18 152)", textColor: "oklch(0.98 0.02 156)" },
  { value: "oklch(0.70 0.15 162)", label: "Esmeralda", color: "oklch(0.70 0.15 162)", textColor: "oklch(0.98 0.02 166)" },
  { value: "oklch(0.78 0.13 182)", label: "Teal", color: "oklch(0.78 0.13 182)", textColor: "oklch(0.98 0.01 181)" },

];


export function CardapioTemaSelect({ control, name }: CardapioTemaSelectProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Escolha um tema" />
          </SelectTrigger>
          <SelectContent>
            {coresDisponiveis.map((cor) => (
                <SelectItem key={cor.value} value={cor.value} className="flex items-center gap-2">
                <Badge
                    variant="colorPreview"
                    className="rounded-full px-3 py-0.5 text-xs"
                    style={{ backgroundColor: cor.color, color: cor.textColor }}
                >
                    {cor.label}
                </Badge>
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
