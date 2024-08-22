import { Variants, motion } from "framer-motion";
import { Button } from "../../shared/button";
import { BubbleBackground } from "../../entities/bubble-background";
import { LogoRedirect } from "../../widgets/logo-redirect";
import { Link } from "react-router-dom";
import unexpectedErrorImg from "../../assets/images/500-unexpected-error.svg";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      delayChildren: 0.15,
      duration: 0.15,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
      duration: 0.15,
    },
  },
};

const childrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 5,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

const imageAnimation: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

export const UnexpectedErrorPage = () => {
  return (
    <motion.div
      className="flex flex-col w-full h-screen font-nunito"
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      exit={AnimationStage.HIDDEN}
      variants={staggerChildrenAnimation}
    >
      <BubbleBackground />

      <div className="z-10 mr-auto">
        <LogoRedirect />
      </div>

      <div className="mt-3">
        <motion.div variants={childrenAnimation}>
          <p className="text-primary-400 text-4xl font-bold text-center mb-8">
            Unexpected error occured!
          </p>
        </motion.div>
        <motion.div className="flex flex-row flex-wrap items-center justify-center dark:brightness-50">
          <motion.img
            variants={imageAnimation}
            src={unexpectedErrorImg}
            alt=""
            className="h-[440px]"
          />
        </motion.div>
      </div>
      <motion.div
        className="flex flex-row flex-wrap items-center justify-center mt-10"
        variants={childrenAnimation}
      >
        <Link to={`/`}>
          <Button className="w-[200px]">
            <p className="font-bold">Go back home</p>
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};
