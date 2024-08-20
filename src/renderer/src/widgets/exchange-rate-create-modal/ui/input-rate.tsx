import { cn } from "../../../shared/utils/cn";

interface Props {
  className?: string;
  label?: React.ReactNode;
  input?: React.ReactNode;
}

export const InputRate: React.FC<Props> = ({ className, label, input }) => {
  return (
    <div
      className={cn(
        "flex flex-row flex-wrap items-center gap-3 mt-5",
        className
      )}
    >
      <div className="w-[40px] text-sm text-neutral-400 font-semibold">
        {label}
      </div>
      <div>{input}</div>
    </div>
  );
};
