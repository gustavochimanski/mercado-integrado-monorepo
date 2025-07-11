import * as React from "react";
import { cn } from "@supervisor/lib/utils";

interface IntegerInputProps extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  value: number;
  onChange: (value: number) => void;
}

const IntegerInput = React.forwardRef<HTMLInputElement, IntegerInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Converte o valor digitado para inteiro
      const newValue = parseInt(e.target.value, 10);
      // Se o valor não for um número, podemos definir um padrão, como 0 ou simplesmente ignorar
      onChange(isNaN(newValue) ? 0 : newValue);
    };

    return (
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className={cn(
          "flex h-6 w-full rounded-2xl border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

IntegerInput.displayName = "IntegerInput";

export { IntegerInput };
