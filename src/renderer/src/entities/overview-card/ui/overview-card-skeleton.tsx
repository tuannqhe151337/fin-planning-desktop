import { motion, Variants } from "framer-motion";
import { cn } from "../../../shared/utils/cn";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
  },
};

interface Props {
  className?: string;
}

export const OverviewCardSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <motion.div
      className={cn(
        "w-full h-[100px] rounded-xl bg-neutral-200 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-700 animate-pulse",
        className
      )}
      variants={animation}
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      exit={AnimationStage.HIDDEN}
    />
  );
};
