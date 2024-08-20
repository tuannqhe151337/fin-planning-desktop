import { useRef } from "react";
import { TERipple, TETooltip } from "tw-elements-react";

interface Props {
  icon?: React.ReactNode;
  text?: React.ReactNode;
  selected?: boolean;
  isExpanded?: boolean;
}

export const Tab: React.FC<Props> = ({
  icon,
  text,
  selected = false,
  isExpanded,
}) => {
  const ref = useRef<HTMLElement>(null);

  return (
    <TERipple
      ref={ref}
      rippleColor="primary"
      className={`cursor-pointer w-full ${
        selected
          ? "bg-primary-100 dark:bg-primary-950"
          : "hover:bg-primary-50 hover:dark:bg-primary-950/50"
      } rounded-lg duration-300 overflow-hidden`}
    >
      <TETooltip
        className={`flex flex-row items-center pl-5 pr-2 py-4 gap-5 text-primary-500 w-full`}
        title={text}
        placement="right"
        enabled={!isExpanded}
      >
        <div className="opacity-80">{icon}</div>
        {isExpanded && (
          <div className="text-sm font-bold text-left select-none">{text}</div>
        )}
      </TETooltip>
    </TERipple>
  );
};
