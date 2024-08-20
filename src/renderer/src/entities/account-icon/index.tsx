import { MdAccountCircle } from "react-icons/md";
import { IconButton } from "../../shared/icon-button";
import { Variants, motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useCloseOutside } from "../../shared/hooks/use-close-popup";
import { TERipple } from "tw-elements-react";
import { Link } from "react-router-dom";

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
  onLogoutClick?: Function;
}

export const AccountIcon: React.FC<Props> = ({ onLogoutClick }) => {
  const { t } = useTranslation(["header"]);

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const ref = useCloseOutside({
    open: isDropdownOpen,
    onClose: () => {
      setIsDropdownOpen(false);
    },
  });

  return (
    <div ref={ref} className="relative z-30">
      <IconButton
        className="p-[6px]"
        onClick={() => {
          setIsDropdownOpen((prevState) => !prevState);
        }}
      >
        <MdAccountCircle className="text-4xl text-primary" />
      </IconButton>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="absolute flex flex-col flex-wrap right-0 shadow bg-white dark:bg-neutral-800 z-20 rounded-lg overflow-hidden"
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            exit={AnimationStage.HIDDEN}
            variants={animation}
          >
            <TERipple rippleColor="light" className="w-full">
              <Link to={`/profile`}>
                <div className="w-full min-w-max px-7 py-2.5 text-neutral-500 dark:text-neutral-300 cursor-pointer select-none hover:bg-primary-100 dark:hover:bg-primary-900 text-base font-semibold duration-200">
                  {t("profile")}
                </div>
              </Link>
            </TERipple>
            <TERipple
              rippleColor="light"
              className="w-full"
              onClick={() => {
                onLogoutClick && onLogoutClick();
              }}
            >
              <div className="w-full min-w-max px-7 py-2.5 text-red-500 cursor-pointer select-none hover:bg-primary-100 dark:hover:bg-primary-900 text-base font-semibold duration-200">
                {t("logout")}
              </div>
            </TERipple>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
