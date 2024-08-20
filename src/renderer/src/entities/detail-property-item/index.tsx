import { AnimatePresence, Variants, motion } from "framer-motion";
import { Skeleton } from "../../shared/skeleton";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 5,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

interface Props {
  isFetching?: boolean;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  value?: React.ReactNode;
}

export const DetailPropertyItem: React.FC<Props> = ({
  isFetching,
  icon,
  title,
  value,
}) => {
  return (
    <div className="flex flex-row flex-wrap items-center gap-6">
      <div className="text-3xl text-neutral-300 dark:text-neutral-500">
        {icon}
      </div>
      <div className="relative flex-1 h-[46px]">
        <AnimatePresence>
          {isFetching && <Skeleton className="absolute w-[300px] h-[46px]" />}
          {!isFetching && (
            <motion.div
              className="absolute"
              variants={animation}
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              exit={AnimationStage.HIDDEN}
            >
              <div className="flex flex-col flex-wrap gap-0.5">
                <div className="text-sm font-semibold text-neutral-400 dark:font-bold dark:text-neutral-500">
                  {title}
                </div>
                <div className="text-base font-bold text-neutral-500 dark:text-neutral-400">
                  {value}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
