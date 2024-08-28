import { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { cn } from "../../shared/utils/cn";

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
  expenseName?: string;
  notes?: string;
  containerClassName?: string;
}

export const ExpenseNamePreviewer: React.FC<Props> = ({
  expenseName,
  notes,
  containerClassName,
}) => {
  // Hover state
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      className={cn("relative max-w-min", containerClassName)}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      <div>{expenseName}</div>
      <AnimatePresence>
        {isHover && notes && (
          <motion.div
            className="absolute z-10 left-[115%] -top-1.5 bg-white dark:bg-neutral-800 border dark:border-neutral-800 rounded-lg shadow dark:shadow-lg cursor-auto"
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            exit={AnimationStage.HIDDEN}
            variants={animation}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="py-2 px-4 w-max font-bold italic text-neutral-400">
              Note: {notes}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
