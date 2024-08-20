import { Variants, motion } from "framer-motion";
import { getZodMessasges } from "../utils/get-zod-messages";
import { cn } from "../utils/cn";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const errorMessageAnimation: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

interface Props {
  validateFn?: Function;
  show?: boolean;
  className?: string;
}

export const InputValidationMessage: React.FC<Props> = ({
  validateFn,
  show = true,
  className,
}) => {
  const result = validateFn && getZodMessasges(validateFn);
  return (
    <motion.div
      className={cn(
        "pl-3 h-[22px] text-sm text-red-500 font-semibold",
        className
      )}
      initial={AnimationStage.HIDDEN}
      animate={show && result ? AnimationStage.VISIBLE : AnimationStage.HIDDEN}
      variants={errorMessageAnimation}
    >
      {validateFn && result}
    </motion.div>
  );
};
