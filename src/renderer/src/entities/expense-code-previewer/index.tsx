import { useEffect, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { cn } from "../../shared/utils/cn";
import { FaCheck, FaCopy } from "react-icons/fa6";

const truncateExpenseCode = (expenseCode?: string) => {
  if (expenseCode) {
    if (expenseCode.length > 8) {
      return expenseCode.toString().substring(0, 8) + "...";
    } else {
      return expenseCode;
    }
  }
};

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
  expenseCode?: string;
  containerClassName?: string;
}

export const ExpenseCodePreviewer: React.FC<Props> = ({
  expenseCode,
  containerClassName,
}) => {
  // Hover state
  const [isHover, setIsHover] = useState<boolean>(false);

  // Copy
  const [onCopied, setOnCopied] = useState<boolean>(false);

  useEffect(() => {
    if (onCopied) {
      expenseCode && navigator.clipboard.writeText(expenseCode);
    }
  }, [onCopied]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onCopied) {
        setOnCopied(false);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [onCopied]);

  // Reset state on first render
  useEffect(() => {
    setOnCopied(false);
  }, []);

  return (
    <div
      className={cn("relative w-max m-auto", containerClassName)}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      <div>{truncateExpenseCode(expenseCode)}</div>
      <AnimatePresence>
        {isHover && expenseCode && (
          <motion.div
            className="absolute z-10 left-[100%] -top-3 bg-white dark:bg-neutral-800 border dark:border-neutral-800 rounded-lg shadow dark:shadow-lg cursor-auto"
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            exit={AnimationStage.HIDDEN}
            variants={animation}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="py-4 px-6 w-max">
              <div className="flex flex-row flex-wrap items-center gap-3 w-max">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setOnCopied(true);
                  }}
                >
                  {onCopied ? (
                    <FaCheck className="text-lg text-green-500" />
                  ) : (
                    <FaCopy className="text-xl -mt-1 -ml-1 text-neutral-400 hover:text-primary-300 duration-200" />
                  )}
                </div>
                <div>{expenseCode}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
