import { cn } from "../utils/cn";

interface Props {
  className?: string;
}

export const Skeleton: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "w-[180px] h-[35px] rounded-lg bg-neutral-300 dark:bg-neutral-700 animate-pulse",
        className
      )}
    ></div>
  );
};
