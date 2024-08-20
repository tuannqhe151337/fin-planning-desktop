import { TERipple } from "tw-elements-react";
import { FaAngleRight } from "react-icons/fa6";
import { format } from "date-fns";
import { cn } from "../../../shared/utils/cn";

interface Props {
  selected?: boolean;
  onClick?: () => any;
  termName: string;
  type: string;
  startDate: string;
  endDate: string;
}

export const TermCard: React.FC<Props> = ({
  selected,
  onClick,
  termName,
  type,
  startDate,
  endDate,
}) => {
  return (
    <TERipple
      className="w-full"
      rippleColor="primary"
      onClick={() => {
        onClick && onClick();
      }}
    >
      <div
        className={cn(
          "flex flex-row flex-wrap items-center w-full h-[55px] py-3 px-5 border-2 border-primary-100 hover:bg-primary-50 hover:border-primary-300 dark:border-primary-900/60 dark:hover:border-primary-800 dark:hover:bg-primary-950/30 rounded-lg cursor-pointer duration-200",
          {
            "bg-primary-50 border-primary-300 dark:border-primary-800 dark:bg-primary-950/30":
              selected,
          }
        )}
      >
        <p className="font-bold text-sm dark:text-base text-primary-500 w-[275px]">
          {termName}
        </p>
        <div className="text-xs px-2 py-1 border-2 border-primary-100 dark:border-primary-900 ml-1 rounded-lg text-primary-400 font-bold select-none">
          {type}
        </div>
        <div className="flex flex-row flex-wrap items-center ml-auto">
          <p className="text-xs dark:text-sm font-bold select-none text-primary-500/60">
            {format(startDate, "dd/MM/yyyy")} - {format(endDate, "dd/MM/yyyy")}
          </p>
          <FaAngleRight className="ml-3 text-lg text-primary-400/80" />
        </div>
      </div>
    </TERipple>
  );
};
