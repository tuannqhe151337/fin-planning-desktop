import { TERipple } from "tw-elements-react";
import { TETooltip } from "tw-elements-react";
import { cn } from "../utils/cn";
import { useDetectDarkmode } from "../hooks/use-detect-darkmode";

interface Props {
  onClick?: React.MouseEventHandler<HTMLElement>;
  containerClassName?: string;
  className?: string;
  tooltip?: string;
  showTooltip?: boolean;
  children?: React.ReactNode;
}

export const IconButton: React.FC<Props> = ({
  children,
  onClick,
  containerClassName,
  className,
  tooltip,
}) => {
  const isDarkMode = useDetectDarkmode();

  return (
    <div className={cn(`rounded-full bg-none overflow-hidden`, containerClassName)}>
      <TERipple
        rippleColor={isDarkMode ? "light" : "dark"}
        tabIndex={-1}
        onClick={(e) => {
          onClick && onClick(e);
        }}
      >
        <TETooltip
          title={tooltip}
          placement="bottom"
          enabled={tooltip ? true : false}
          className={cn(
            "inline-block rounded-full p-[10px] uppercase leading-normal transition duration-150 ease-in-out hover:bg-primary-200 dark:hover:bg-neutral-700 focus:outline-none focus:ring-0",
            className
          )}
        >
          {children}
        </TETooltip>
      </TERipple>
    </div>
  );
};
