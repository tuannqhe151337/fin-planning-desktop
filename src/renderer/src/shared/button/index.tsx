import { TERipple } from "tw-elements-react";
import { cn } from "../utils/cn";
import clsx from "clsx";
import { useDetectDarkmode } from "../hooks/use-detect-darkmode";

type Variant = "primary" | "secondary" | "tertiary" | "quaternary" | "error";
type ButtonType = "filled" | "outlined";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: Variant;
  buttonType?: ButtonType;
  containerClassName?: string;
  className?: string;
}

export const Button: React.FC<Props> = ({
  children,
  variant = "primary",
  buttonType = "filled",
  containerClassName,
  className,
  ...props
}) => {
  const isDarkmode = useDetectDarkmode();

  return (
    <TERipple
      className={containerClassName}
      rippleColor={clsx({
        light:
          variant === "primary" ||
          (variant === "quaternary" && isDarkmode) ||
          (variant === "tertiary" && isDarkmode) ||
          variant === "error",
        primary: variant === "secondary",
        dark: variant === "tertiary" && !isDarkmode,
      })}
    >
      <button
        className={cn(
          "inline-block w-full rounded-lg px-4 pb-1.5 pt-2 text-base font-medium leading-normal transition duration-200 ease-in-out focus:outline-none focus:ring-0",
          {
            "bg-primary disabled:bg-primary-500/50 border-2 border-primary disabled:border-primary-500/5 dark:bg-primary-800 dark:border-primary-800 text-white hover:bg-primary-600 dark:hover:bg-primary-700 focus:bg-primary-600 dark:focus:bg-primary-700 active:bg-primary-700 hover:border-primary-600/10 dark:hover:border-primary-700 focus:border-primary-600/10 dark:focus:border-primary-700 active:border-primary-700 dark:disabled:bg-primary-800/20 dark:disabled:border-primary-800/5 dark:disabled:text-neutral-500":
              variant === "primary",
            "font-semibold bg-primary-100 border-2 border-primary-100 dark:bg-primary-900/50 dark:border-primary-900/10 text-primary-500 hover:bg-primary-200/70 dark:hover:bg-primary-900/70 focus:bg-primary-200 dark:focus:bg-primary-900/70 active:bg-primary-200 hover:border-primary-200/10 dark:hover:border-primary-900/10 focus:border-primary-200 dark:focus:border-primary-900/10 active:border-primary-200 dark:active:border-primary-900/10":
              variant === "secondary",
            "bg-white border-2 border-transparent text-primary-500 hover:bg-primary-50 active:bg-primary-100 dark:bg-neutral-800 dark:border-primary-800 dark:hover:bg-neutral-700/30":
              variant === "tertiary",
            "bg-white border-2 dark:bg-transparent text-neutral-400 disabled:text-neutral-300 border-neutral-200 disabled:hover:border-neutral-200 hover:border-neutral-300 dark:border-neutral-600 dark:disabled:hover:border-neutral-600 dark:hover:border-neutral-500 dark:text-neutral-400 dark:disabled:text-neutral-500":
              variant === "quaternary",
            "text-white dark:text-neutral-200 border-2 bg-red-600 border-red-600 hover:bg-red-500 hover:border-red-500 active:bg-red-500 active:border-red-500 focus:bg-red-500 focus:border-red-500 dark:bg-red-800 dark:border-red-800 dark:hover:bg-red-700 dark:hover:border-red-700 dark:active:bg-red-700 dark:active:border-red-700 dark:focus:bg-red-700 dark:focus:border-red-700":
              variant === "error" && buttonType === "filled",
            "font-bold dark:font-extrabold border-2 text-red-500 bg-white hover:bg-red-50 focus:bg-red-100 border-red-200 active:bg-red-100 dark:text-red-600 dark:bg-transparent dark:border-red-900/60 dark:hover:bg-red-900/50 dark:focus:bg-red-900/50":
              variant === "error" && buttonType === "outlined",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    </TERipple>
  );
};
