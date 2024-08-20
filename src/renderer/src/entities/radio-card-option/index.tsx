import clsx from "clsx";
import React from "react";
import { TETooltip } from "tw-elements-react";

interface RadioOptionProps {
  disabled?: boolean;
  tooltip?: string;
  label?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  radioInput?: React.ReactNode;
  description?: React.ReactNode;
  isSelected?: boolean;
}

const RadioCardOption: React.FC<RadioOptionProps> = ({
  disabled,
  tooltip,
  label,
  onClick,
  radioInput,
  description,
  isSelected,
}) => {
  return (
    <div
      className="w-full"
      onClick={(e) => {
        onClick && onClick(e);
      }}
    >
      <TETooltip
        tag="div"
        className={clsx({
          "flex flex-row items-center w-full group border rounded-lg py-9 px-4 duration-200":
            true,
          "cursor-default": disabled,
          "cursor-pointer": !disabled,
          "dark:bg-primary-900/50 bg-primary-100 text-primary h-[66px] border-primary-200 dark:border-primary-500":
            isSelected,
          "bg-white text-neutral-600 h-[66px] dark:bg-neutral-800/50 dark:border-neutral-600":
            !isSelected,
          "hover:border-neutral-300 hover:shadow": !isSelected && !disabled,
        })}
        enabled={tooltip !== undefined && tooltip !== null && tooltip !== ""}
        title={tooltip}
      >
        <div className="flex items-center mb-[0.125rem] mr-4 min-h-[1.5rem]">
          {radioInput}
          <label className="flex flex-col pl-[0.15rem]">
            <p
              className={clsx({
                "mb-1 duration-200 font-extrabold opacity-70 text-left": true,
                "text-neutral-600 dark:text-primary-500 group-hover:text-neutral-700 dark:group-hover:text-primary-400":
                  !isSelected && !disabled,
                "text-primary-600 dark:text-primary-500": isSelected,
                "text-neutral-400 dark:text-neutral-500": disabled,
                "cursor-pointer": !disabled,
              })}
            >
              {label}
            </p>
            <p
              className={clsx({
                "text-sm font-bold opacity-70": true,
                "text-neutral-500 dark:text-primary-600 group-hover:text-neutra-600 dark:group-hover:text-primary-500/80":
                  !isSelected && !disabled,
                "text-primary-500 dark:text-primary-500 duration-200":
                  isSelected,
                "text-neutral-300 dark:text-neutral-500": disabled,
                "cursor-pointer": !disabled,
              })}
            >
              {description}
            </p>
          </label>
        </div>
      </TETooltip>
    </div>
  );
};

export default RadioCardOption;
