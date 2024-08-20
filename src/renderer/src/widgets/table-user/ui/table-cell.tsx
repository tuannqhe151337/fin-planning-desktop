import { cn } from "../../../shared/utils/cn";

interface Props {
  isFetching?: boolean;
  skeletonClassName?: string;
  children?: React.ReactNode;
}

export const TableCell: React.FC<Props> = ({
  children,
  isFetching,
  skeletonClassName,
}) => (
  <td className="whitespace-nowrap py-7 font-bold">
    {isFetching ? (
      <span
        className={cn(
          "block h-[30px] mx-auto bg-neutral-200/70 animate-pulse rounded",
          skeletonClassName
        )}
      ></span>
    ) : (
      <p
        className="font-bold px-1 cursor-auto"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </p>
    )}
  </td>
);
