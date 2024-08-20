import React from "react";
import { InputValidationMessage } from "../../shared/validation-input-message";
import {
  DatePickerInputProps,
  DatePickerInput as DatePickerInputShared,
} from "../../shared/date-picker-input";
import clsx from "clsx";

interface Props extends DatePickerInputProps {
  label?: React.ReactNode;
  showValidationMessage?: boolean;
  validateFn?: Function;
}

export const DatePickerInputWithErrorAndLabel: React.FC<Props> = ({
  label,
  showValidationMessage,
  validateFn,
  disabled,
  ...props
}) => {
  return (
    <div className="flex flex-col flex-wrap gap-0.5">
      <div
        className={clsx({
          "text-xs font-semibold dark:font-bold": true,
          "text-neutral-400 dark:text-neutral-400/70": !disabled,
          "text-neutral-300 dark:text-neutral-600": disabled,
        })}
      >
        {label}
      </div>
      <div className="custom-wrapper w-[200px]">
        <DatePickerInputShared disabled={disabled} {...props} />

        <InputValidationMessage
          className="mt-1 w-max"
          show={showValidationMessage}
          validateFn={validateFn}
        />
      </div>
    </div>
  );
};
