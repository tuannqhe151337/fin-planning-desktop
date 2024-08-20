import { AnimatePresence, Variants, motion } from "framer-motion";
import { cn } from "../utils/cn";

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
  showSkeleton?: boolean;
  showInput?: boolean;
  children?: React.ReactNode;
  containerClassName?: string;
  skeletonClassName?: string;
  className?: string;
}

export const InputSkeleton: React.FC<Props> = ({
  showSkeleton = false,
  showInput = true,
  containerClassName,
  skeletonClassName,
  className,
  children,
}) => {
  return (
    <div className={cn("relative h-[64px]", containerClassName)}>
      <AnimatePresence>
        {showSkeleton && (
          <motion.div
            className={cn(
              "absolute w-[500px] h-[35px] mt-1 mx-auto bg-neutral-300 animate-pulse",
              skeletonClassName
            )}
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            exit={AnimationStage.HIDDEN}
            variants={animation}
          />
        )}
        {showInput && (
          <motion.div
            className={cn("absolute", className)}
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            exit={AnimationStage.HIDDEN}
            variants={animation}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
