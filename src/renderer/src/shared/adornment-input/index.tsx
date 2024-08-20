import clsx from "clsx";
import { forwardRef } from "react";
import { TEInput } from "tw-elements-react";
import { InputProps } from "tw-elements-react/dist/types/forms/Input/types";

interface Props extends InputProps {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const AdornmentInput = forwardRef<any, Props>(
  ({ startAdornment, endAdornment, ...props }, ref) => {
    return (
      <div className="relative w-full h-full">
        {startAdornment && (
          <div className="absolute h-max flex flex-row flex-wrap items-center left-0 right-0 w-max z-10">
            {startAdornment}
          </div>
        )}
        <TEInput
          ref={ref}
          className={clsx({ "pl-7": startAdornment, "pr-7": endAdornment })}
          {...props}
        />
        {endAdornment && (
          <div className="absolute h-max flex flex-row flex-wrap items-center top-0 right-0 w-max z-10">
            {endAdornment}
          </div>
        )}
      </div>
    );
  }
);
