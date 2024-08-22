import { Variants, motion } from "framer-motion";
import { Button } from "../../shared/button";
import { BubbleBackground } from "../../entities/bubble-background";
import { LogoRedirect } from "../../widgets/logo-redirect";
import { Link } from "react-router-dom";
import notFoundImg from "../../assets/images/400-not-found.svg";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const imageAnimation: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-screen font-nunito">
      <BubbleBackground />

      <div className="z-10 mr-auto">
        <LogoRedirect />
      </div>

      <div className="mt-10">
        <motion.div className="flex flex-row flex-wrap items-center justify-center dark:brightness-50">
          <motion.img
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            variants={imageAnimation}
            src={notFoundImg}
            alt=""
            className="h-[440px]"
          />
        </motion.div>
      </div>
      <motion.div
        className="flex flex-row flex-wrap items-center justify-center mt-10"
        initial={AnimationStage.HIDDEN}
        animate={AnimationStage.VISIBLE}
        variants={imageAnimation}
      >
        <Link to={`/`}>
          <Button className="w-[200px]">
            <p className="font-bold">Go back home</p>
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};
