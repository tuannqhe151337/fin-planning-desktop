import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
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
  show?: boolean;
  className?: string;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  children?: React.ReactNode;
}

const duration = 200; // In miliseconds

export const ContextMenu: React.FC<Props> = ({
  show,
  className,
  top,
  left,
  bottom,
  right,
  children,
}) => {
  const [showContextMenu, setShowContextMenu] = useState<
    boolean | null | undefined
  >(show);

  // Delay 200ms to wait for modal to unmount after running animation
  useEffect(() => {
    if (show) {
      setShowContextMenu(true);
    } else {
      const timeoutId = setTimeout(() => {
        setShowContextMenu(false);
      }, duration);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [show]);

  return (
    <>
      {showContextMenu &&
        ReactDOM.createPortal(
          <div
            className={cn("absolute z-10", className)}
            style={{
              top,
              left,
              bottom,
              right,
            }}
          >
            <AnimatePresence>
              {show && (
                <motion.div
                  className={cn(
                    "shadow-lg bg-white dark:bg-neutral-700 rounded-lg mt-2 overflow-hidden",
                    className
                  )}
                  initial={AnimationStage.HIDDEN}
                  animate={AnimationStage.VISIBLE}
                  exit={AnimationStage.HIDDEN}
                  variants={animation}
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </div>,
          document.querySelector("#context-menu") as HTMLDivElement
        )}
    </>
  );
};
