import React from "react";
import { TERipple } from "tw-elements-react";
import { RippleProps } from "tw-elements-react/dist/types/methods/Ripple/types";
import { cn } from "../utils/cn";

interface Props extends RippleProps {
  containerClassName?: string;
  className?: string;
  borderBottom?: boolean;
  icon?: React.ReactNode;
  text?: React.ReactNode;
}

export const ContextMenuItem: React.FC<Props> = ({
  containerClassName,
  className,
  borderBottom,
  icon,
  text,
  ...props
}) => {
  return (
    <TERipple
      rippleColor="light"
      className={cn(
        "group w-full",
        {
          "border-b-2 border-b-neutral-200/50 dark:border-b-neutral-600":
            borderBottom,
        },
        containerClassName
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-row flex-wrap items-center gap-5 px-5 py-3 text-neutral-500/80 group-hover:text-primary-600 dark:text-neutral-300 dark:group-hover:text-primary-300 cursor-pointer select-none hover:bg-primary-100 dark:hover:bg-primary-900 text-sm font-bold duration-200",
          className
        )}
      >
        <div className="w-[20px]">{icon}</div>
        <div>{text}</div>
      </div>
    </TERipple>
  );
};
