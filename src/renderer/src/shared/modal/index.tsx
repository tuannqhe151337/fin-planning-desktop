import ReactDOM from "react-dom";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../shared/utils/cn";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

const duration = 200; // In miliseconds

interface Props {
  containerClassName?: string;
  className?: string;
  show: boolean;
  onClose: () => any;
  children?: React.ReactElement;
}

export const Modal: React.FC<Props> = ({
  containerClassName,
  className,
  show,
  onClose,
  children,
}) => {
  // Close modal when click outside
  const modalRef = useRef<HTMLDivElement>(null);

  const [showModal, setShowModal] = useState<boolean>(show);

  useHotkeys("esc", () => {
    onClose && onClose();
  });

  const clickHandler = useCallback(
    (event: MouseEvent) => {
      if (!modalRef.current?.contains(event.target as Node)) {
        onClose && onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      document.addEventListener("click", clickHandler, true);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("click", clickHandler, true);
    };
  }, [show]);

  // Delay 200ms to wait for modal to unmount after running animation
  useEffect(() => {
    if (show) {
      setShowModal(true);
    } else {
      const timeoutId = setTimeout(() => {
        setShowModal(false);
      }, duration);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [show]);

  return (
    <>
      {showModal &&
        ReactDOM.createPortal(
          <div
            className={cn(
              `fixed flex w-full h-full top-0 left-0 backdrop-blur z-30 cursor-pointer`,
              containerClassName,
            )}
          >
            <AnimatePresence>
              {show && (
                <motion.div
                  ref={modalRef}
                  className={cn(
                    "bg-white dark:bg-neutral-800 w-[500px] h-[500px] m-auto shadow-[0px_0px_50px] shadow-neutral-300 dark:shadow-black rounded-xl cursor-auto",
                    className,
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
          document.querySelector("#popup") as HTMLDivElement,
        )}
    </>
  );
};
