import { AnimatePresence, motion, Variants } from "framer-motion";
import { FaCircleUser } from "react-icons/fa6";
import { cn } from "../../shared/utils/cn";
import { Skeleton } from "../../shared/skeleton";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
};

const childrenAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 3,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

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
  isLoading?: boolean;
  username: string;
  role: string;
  position: string;
  department: string;
}

export const UserAvatarCard: React.FC<Props> = ({
  className,
  isLoading,
  username,
  role,
  position,
  department,
}) => {
  return (
    <motion.div
      className={cn(
        "border rounded-lg p-4 bg-white shadow dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-[0_0_15px_rgb(0,0,0,0.2)]",
        className
      )}
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      exit={AnimationStage.HIDDEN}
      variants={staggerChildrenAnimation}
    >
      <div className="flex justify-center items-center dark:brightness-50 mx-auto rounded-full">
        <FaCircleUser className="text-[160px] opacity-80 text-primary-200 dark:text-primary-300" />
      </div>

      <motion.div
        className="relative h-[35px] mt-4"
        variants={childrenAnimation}
      >
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute w-full"
              variants={animation}
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              exit={AnimationStage.HIDDEN}
            >
              <Skeleton className="w-[120px] mx-auto mt-1" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isLoading && (
            <motion.p
              className="absolute w-full text-primary-600/80 font-extrabold text-2xl text-center dark:text-primary-600"
              variants={animation}
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              exit={AnimationStage.HIDDEN}
            >
              {username}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="relative h-[35px] mt-4"
        variants={childrenAnimation}
      >
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute w-full"
              variants={animation}
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              exit={AnimationStage.HIDDEN}
            >
              <Skeleton className="w-[180px] mx-auto mt-1" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isLoading && (
            <motion.div
              className="absolute w-full"
              variants={animation}
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              exit={AnimationStage.HIDDEN}
            >
              <p className="w-1/2 py-2 bg-primary-500 text-center text-white font-bold mx-auto rounded dark:bg-primary-800 dark:text-white/80">
                {role}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="relative mt-4 h-[35px]"
        variants={childrenAnimation}
      >
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute w-full"
              variants={animation}
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              exit={AnimationStage.HIDDEN}
            >
              <Skeleton className="w-[300px] h-[24px] mx-auto mt-1" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isLoading && (
            <motion.div
              className="absolute w-full mt-2"
              variants={animation}
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              exit={AnimationStage.HIDDEN}
            >
              <p className="text-neutral-400/70 font-bold text-base text-center dark:opacity-60">
                {position} at {department}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
