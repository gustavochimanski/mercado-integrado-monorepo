"use client";

import { DatePicker } from "@mui/x-date-pickers";
import { Controller, Control } from "react-hook-form";
import { TextFieldProps } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ptBR } from "date-fns/locale/pt-BR";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Props {
  name: string;
  control: Control<any>;
  label: string;
  error?: string;
}

export function CustomDatePicker({ name, control, label, error }: Props) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ptBR} // <-- esse é o correto
          >
        <DatePicker
          label={label}
          value={field.value}
          onChange={(val) => val && field.onChange(val)}
          format="dd/MM/yyyy"
          sx={{
            "& .MuiPickersDay-root:focus, & .MuiPickersMonth-root:focus, & .MuiPickersYear-root:focus": {
              backgroundColor: "transparent",
            },
            "& .MuiPickersDay-root.Mui-focused, & .MuiPickersMonth-root.Mui-focused, & .MuiPickersYear-root.Mui-focused": {
              outline: "none",
            },
          }}
          slotProps={{
            textField: {
              InputProps: { disableUnderline: true },
              variant: "standard",
              className:
                "h-7 bg-background text-center rounded-l-none border-none shadow-none text-sm",
              error: !!error,
              helperText: error,
            } as TextFieldProps,
          }}
        />
        
        </LocalizationProvider>

      )}
    />
  );
}
