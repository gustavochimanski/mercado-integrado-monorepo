import React, { useState } from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';
import { Input } from '@supervisor/components/ui/input';

interface CurrencyInputProps
  extends Omit<NumericFormatProps, 'customInput' | 'onValueChange' | 'value'> {
  onChangeValue: (value: number) => void;
  value?: number;
}

export const FloatInput: React.FC<CurrencyInputProps> = ({
  onChangeValue,
  ...props
}) => {
  // Estado para armazenar o valor atual; inicialmente null = input vazio
  const [internalValue, setInternalValue] = useState<number | null>(props.value ?? null);

  return (
    <NumericFormat
      {...props}
      // Se ainda não houve alteração, exibe string vazia; caso contrário, o valor atual
      value={internalValue === null ? '' : internalValue}
      customInput={Input}
      onValueChange={(values) => {
        // Atualiza o estado: se floatValue for undefined, volta para null
        const newValue = values.floatValue ?? null;
        setInternalValue(newValue);
        onChangeValue(newValue ?? 0);
      }}
      thousandSeparator="."
      decimalSeparator=","
      fixedDecimalScale
      decimalScale={2}
    />
  );
};
