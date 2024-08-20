import { cn } from "../utils/cn";

type Background = "filled" | "unfilled";
type Variant =
  | "new"
  | "reviewed"
  | "waiting"
  | "denied"
  | "deactivate"
  | "inProgress";

interface Props {
  children?: React.ReactNode;
  className?: string;
  background?: Background;
  variant?: Variant;
}

export const Tag: React.FC<Props> = ({
  children,
  className,
  background = "filled",
  variant = "new",
}) => {
  return (
    <div
      className={cn(
        {
          "text-xs font-bold text-center w-max": true,
          rounded: true,
          "border dark:border-neutral-900/40 dark:shadow-lg": true,
          "duration-200": true,
          "py-1 px-4": true,
          shadow: true,
          "bg-white text-green-600 font-bold dark:font-extrabold  dark:bg-neutral-800  dark:border-neutral-800 group-hover:text-green-700 group-hover:bg-white/85 dark:group-hover:text-green-500 dark:group-hover:bg-neutral-900/70":
            background === "unfilled" && variant === "new",
          "bg-green-600 text-white/90 font-bold dark:font-extrabold dark:bg-green-700  dark:border-neutral-800 dark:text-white/70 group-hover:text-white group-hover:bg-green-700 dark:group-hover:bg-green-800 dark:group-hover:text-white/80":
            background === "filled" && variant === "reviewed",
          "bg-primary-500 text-white/90 font-bold dark:font-extrabold dark:bg-primary-700  dark:border-neutral-800 dark:text-white/70 group-hover:text-white group-hover:bg-primary-600 dark:group-hover:bg-primary-800 dark:group-hover:text-white/80":
            background === "filled" && variant === "inProgress",
          "bg-white text-primary-500 font-bold dark:font-extrabold dark:bg-neutral-800  dark:border-neutral-800 group-hover:text-primary-700 group-hover:bg-white/85 dark:group-hover:text-primary-600 dark:group-hover:bg-neutral-900/70":
            background === "unfilled" && variant === "waiting",
          "bg-white text-red-600 font-extrabold dark:text-red-800 dark:bg-neutral-800  dark:border-neutral-800 group-hover:text-red-700/95 group-hover:bg-white/85 dark:group-hover:text-red-600 dark:group-hover:bg-neutral-900/70":
            background === "unfilled" && variant === "denied",
          "font-extrabold text-gray-500/70 dark:text-gray-500 dark:group-hover:text-gray-400 group-hover:text-gray-500 inline-block dark:border-neutral-900":
            background === "unfilled" && variant === "deactivate",
        },
        className
      )}
    >
      {children}
    </div>
  );
};
