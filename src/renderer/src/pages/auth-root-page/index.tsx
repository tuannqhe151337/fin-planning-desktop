import { Outlet } from "react-router-dom";
import { Variants, motion } from "framer-motion";
import { ThemeChanger } from "../../features/theme-changer";
import { LanguageChanger } from "../../features/language-changer";
import { DarkmodeChanger } from "../../features/darkmode-changer";
import { BubbleBackground } from "../../entities/bubble-background";
import { usePageAuthorizedForRole } from "../../features/use-page-authorized-for-role";
import { Role } from "../../providers/store/api/type";
import lamviecImg from "../../assets/images/lamviec.svg";

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

export const AuthRootPage: React.FC = () => {
  // Authorized
  usePageAuthorizedForRole([Role.ACCOUNTANT, Role.FINANCIAL_STAFF]);

  return (
    <div className="flex flex-row flex-wrap w-full">
      <div className="flex flex-row flex-wrap items-center w-full z-20">
        <div className=" text-5xl text-primary-500 ml-16 p-6">
          <span className="text-4xl font-black">F</span>
          <span className="text-3xl font-extrabold">in</span>
          <span className="text-4xl font-black">P</span>
          <span className="text-3xl font-extrabold">lanning</span>
        </div>

        <div className="ml-auto flex flex-row flex-wrap items-center pr-10 z-20">
          <div className="ml-1.5">
            <LanguageChanger></LanguageChanger>
          </div>
          <ThemeChanger></ThemeChanger>
          <DarkmodeChanger></DarkmodeChanger>
        </div>
      </div>

      <BubbleBackground></BubbleBackground>

      <div className="flex flex-row flex-wrap w-full">
        <div className="flex-1">
          <motion.div className="flex justify-center items-center dark:brightness-50">
            <motion.img
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              variants={imageAnimation}
              src={lamviecImg}
              alt=""
            />
          </motion.div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};
