import { motion, AnimatePresence, Variants } from "framer-motion";
import React from "react";
import { FaCircleExclamation } from "react-icons/fa6";
import { cn } from "../utils/cn";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const heightPlaceholderAnimation: Variants = {
  hidden: {
    height: 0,
    transition: {
      delay: 0.5,
    },
  },
  visible: {
    height: 60,
  },
};

interface Props {
  className?: string;
  show?: boolean;
  errorMessage?: React.ReactNode;
}

export const ErrorNotificationCard: React.FC<Props> = ({
  className,
  show,
  errorMessage,
}) => {
  return (
    <div className={cn("relative w-full", className)}>
      <AnimatePresence>
        {show && (
          <div className="absolute w-full">
            <div className="flex flex-row flex-wrap items-center p-3 gap-3 bg-red-400/30 dark:bg-red-800/30 rounded-lg w-full">
              <FaCircleExclamation className="text-red-500 dark:text-red-600" />
              <p className="text-sm text-red-600 dark:text-red-500 font-semibold">
                {errorMessage}
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={AnimationStage.HIDDEN}
        animate={show ? AnimationStage.VISIBLE : AnimationStage.HIDDEN}
        variants={heightPlaceholderAnimation}
      />
    </div>
  );
};
