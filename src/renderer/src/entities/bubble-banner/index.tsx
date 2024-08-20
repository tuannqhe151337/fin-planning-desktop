import { Variants, motion } from "framer-motion";

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

interface Props {
  children?: React.ReactElement;
}

export const BubbleBanner: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative bg-primary-100 dark:bg-primary-950/50 w-full h-[200px] rounded-lg overflow-hidden">
      <div className="absolute shadow-2xl bg-primary-200 dark:bg-primary-950 size-[600px] rounded-full -right-36 -top-10"></div>
      <motion.div
        className="flex p-5 w-full h-full"
        initial={AnimationStage.HIDDEN}
        animate={AnimationStage.VISIBLE}
        exit={AnimationStage.HIDDEN}
        variants={animation}
      >
        {children}
      </motion.div>
    </div>
  );
};
