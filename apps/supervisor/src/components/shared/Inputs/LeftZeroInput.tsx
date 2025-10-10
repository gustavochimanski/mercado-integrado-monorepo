import React, { useState, useEffect } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { cn } from "@supervisor/lib/utils";
import { Input } from "@supervisor/components/ui/input";

interface LeftZeroInputProps
  extends Omit<NumericFormatProps, "onValueChange" | "customInput"> {
  value: string;
  onFormattedChange: (val: string) => void;
  className?: string;
}

const LeftZeroInput: React.FC<LeftZeroInputProps> = ({
  value,
  onFormattedChange,
  className,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState("");

  useEffect(() => {
    setInternalValue(value.replace(/^0+/, "") || "");
  }, [value]);

  const handleBlur = () => {
    const formatted = internalValue.padStart(3, "0");
    onFormattedChange(formatted);
  };

  return (
    <NumericFormat
      value={internalValue}
      onValueChange={(vals) => {
        const numericOnly = vals.value.slice(0, 3);
        setInternalValue(numericOnly);
      }}
      onBlur={handleBlur}
      customInput={Input}
      allowLeadingZeros={false}
      allowNegative={false}
      decimalScale={0}
      type="text"
      className={cn(
        className
      )}
      {...props}
    />
  );
};


export default LeftZeroInput;
