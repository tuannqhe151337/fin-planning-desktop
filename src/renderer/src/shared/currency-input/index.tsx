import { NumericFormat, OnValueChange } from "react-number-format";
import { AdornmentInput } from "../adornment-input";

interface Props {
  value?: number;
  onChange?: OnValueChange;
}

export const CurrencyInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <NumericFormat
      value={value}
      className="w-full focus:-outline-offset-1 focus:outline-primary focus:outline-[2px] duration-200"
      onValueChange={(value, sourceInfo) => {
        onChange && onChange(value, sourceInfo);
      }}
      thousandSeparator="."
      decimalSeparator=","
      valueIsNumericString
      endAdornment={<div className="text-base mt-1.5 pr-3 select-none">đ</div>}
      customInput={AdornmentInput}
    />
  );
};
