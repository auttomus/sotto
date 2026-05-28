import * as React from "react";

interface UseClearableNumberInputOptions {
  value: number | undefined | null;
  onChange: (val: number) => void;
  min: number;
  defaultValue: number;
}

export function useClearableNumberInput({
  value,
  onChange,
  min,
  defaultValue,
}: UseClearableNumberInputOptions) {
  const [strVal, setStrVal] = React.useState(
    value !== undefined && value !== null ? value.toString() : defaultValue.toString()
  );

  React.useEffect(() => {
    if (value !== undefined && value !== null && value.toString() !== strVal) {
      setStrVal(value.toString());
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStrVal(val);
    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed >= min) {
      onChange(parsed);
    }
  };

  const handleInputBlur = () => {
    const parsed = parseInt(strVal);
    if (isNaN(parsed) || parsed < min) {
      setStrVal(defaultValue.toString());
      onChange(defaultValue);
    }
  };

  return {
    value: strVal,
    onChange: handleInputChange,
    onBlur: handleInputBlur,
    setValue: (val: number) => {
      setStrVal(val.toString());
      onChange(val);
    },
  };
}
