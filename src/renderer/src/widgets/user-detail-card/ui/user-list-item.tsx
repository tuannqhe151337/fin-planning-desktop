import { AnimatePresence, motion, Variants } from "framer-motion";

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
  isLoading?: boolean;
  icon?: React.ReactNode | null;
  label?: string | null;
  value?: string | null;
}

export const UserListItem: React.FC<Props> = ({
  isLoading,
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex gap-4">
      <div className="w-1/12 pt-3 pl-4 text-xl opacity-40 dark:opacity-30">
        {icon}
      </div>
      <div className="w-11/12">
        <div className="font-bold text-sm opacity-40 dark:opacity-30">
          {label}
        </div>
        <div className="relative h-[24px]">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="absolute w-[200px] h-[24px] mt-1 bg-neutral-300 dark:bg-neutral-700 animate-pulse"
                variants={animation}
                initial={AnimationStage.HIDDEN}
                animate={AnimationStage.VISIBLE}
                exit={AnimationStage.HIDDEN}
              ></motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isLoading && (
              <motion.div
                className="absolute text-xm font-bold opacity-80 dark:opacity-60 mt-1 text-neutral-500 dark:text-neutral-400"
                initial={AnimationStage.HIDDEN}
                animate={AnimationStage.VISIBLE}
                exit={AnimationStage.HIDDEN}
                variants={animation}
              >
                {value}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
