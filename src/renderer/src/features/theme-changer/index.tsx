import { TERipple } from "tw-elements-react";
import { FaPalette } from "react-icons/fa";
import { IconButton } from "../../shared/icon-button";
import { useEffect, useState } from "react";
import { Variants, motion, AnimatePresence } from "framer-motion";
import { useCloseOutside } from "../../shared/hooks/use-close-popup";
import { ThemeCode, ThemeCodes, themes } from "../../type";
import { changeTheme } from "./utils/change-theme";
import {
  useMeQuery,
  useUserSettingMutation,
} from "../../providers/store/api/authApi";
import clsx from "clsx";

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

export const ThemeChanger = () => {
  // Selected theme
  const [selectedThemeCode, setSelectedThemeCode] = useState<ThemeCode>("blue");

  // Get data
  const { data: me } = useMeQuery();

  // Mutation
  const [updateUserSetting] = useUserSettingMutation();

  // UI
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const ref = useCloseOutside({
    open: isDropdownOpen,
    onClose: () => {
      setIsDropdownOpen(false);
    },
  });

  // Change theme (by changing classes in the body)
  useEffect(() => {
    changeTheme(selectedThemeCode);
  }, [selectedThemeCode]);

  useEffect(() => {
    let typedSelectedThemeCode: ThemeCode = "blue";

    try {
      typedSelectedThemeCode = ThemeCodes.check(selectedThemeCode);
    } catch (_) {
    } finally {
      setSelectedThemeCode(typedSelectedThemeCode);
    }
  }, [me?.settings.theme]);

  return (
    <div ref={ref} className="relative z-50">
      <IconButton
        tooltip="Change theme"
        showTooltip={!isDropdownOpen}
        onClick={() => {
          setIsDropdownOpen((prevState) => !prevState);
        }}
      >
        <FaPalette className="text-xl text-primary-500 dark:text-primary-600" />
      </IconButton>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="absolute z-20 shadow bg-white dark:bg-neutral-800 rounded-lg mt-2 overflow-hidden"
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            exit={AnimationStage.HIDDEN}
            variants={animation}
          >
            {Object.values(themes).map(({ code, name }, index) => (
              <TERipple
                key={name}
                rippleColor="light"
                className="w-full"
                onClick={() => {
                  setSelectedThemeCode(code);

                  if (me) {
                    updateUserSetting({
                      theme: code,
                      language: me.settings.language,
                      darkMode: me.settings.darkMode,
                    });
                  }
                }}
              >
                <div
                  className={clsx({
                    "px-5 py-3 text-neutral-500 dark:text-neutral-300 cursor-pointer select-none hover:bg-primary-100 dark:hover:bg-primary-900 text-base font-semibold duration-200":
                      true,
                    "border-b-2 border-b-neutral-100 dark:border-b-neutral-700/50":
                      index !== Object.values(themes).length - 1,
                  })}
                >
                  {name}
                </div>
              </TERipple>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
