// import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { BubbleBanner } from "../../entities/bubble-banner";
import { UserDetailCard } from "../../widgets/user-detail-card";
import { UserAvatarCard } from "../../widgets/user-avatar-card";
import {
  useMeQuery,
  useUserSettingMutation,
} from "../../providers/store/api/authApi";
import { Switch } from "../../shared/switch";
import { Link } from "react-router-dom";
import {
  Option as ThemeOption,
  ThemeFilter,
} from "../../entities/theme-filter";
import {
  Option as LanguageOption,
  LanguageFilter,
} from "../../entities/language-filter";
import { useEffect, useState } from "react";
import { changeTheme } from "../../features/theme-changer/utils/change-theme";
import {
  LanguageCode,
  LanguageCodes,
  languages,
  ThemeCode,
  ThemeCodes,
  themes,
} from "../../type";
import { changeLanguage } from "i18next";

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
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

export const Profile: React.FC = () => {
  // Theme change and language change state
  const [themeCode, setThemeCode] = useState<ThemeCode>("blue");
  const [languageCode, setLanguageCode] = useState<LanguageCode>("en");

  // Get data
  const { data, isLoading, isSuccess } = useMeQuery();

  // Mutation
  const [updateUserSetting] = useUserSettingMutation();

  // Handle theme change
  const handleThemeChange = (option: ThemeOption | null | undefined) => {
    if (option && data) {
      updateUserSetting({
        theme: option.value,
        language: data.settings.language,
        darkMode: data.settings.darkMode,
      });
    }
  };

  // Handle language change
  const handleLanguageChange = (option: LanguageOption | null | undefined) => {
    if (option && data) {
      updateUserSetting({
        theme: data.settings.theme,
        language: option.value,
        darkMode: data.settings.darkMode,
      });
    }
  };

  // Handle darkMode change
  const handleDarkModeChange = (option: boolean) => {
    if (data) {
      updateUserSetting({
        theme: data.settings.theme,
        language: data.settings.language,
        darkMode: option,
      });
    }
  };

  // Change theme
  useEffect(() => {
    if (data?.settings.theme) {
      changeTheme(data?.settings.theme as ThemeCode);

      let typedSelectedThemeCode: ThemeCode = "blue";

      try {
        typedSelectedThemeCode = ThemeCodes.check(data.settings.theme);
      } catch (_) {
      } finally {
        setThemeCode(typedSelectedThemeCode);
      }
    }
  }, [data?.settings.theme]);

  // Change language
  useEffect(() => {
    if (data?.settings.language) {
      changeLanguage(data?.settings.language as LanguageCode);

      let typedSelectedLanguageCode: LanguageCode = "en";

      try {
        typedSelectedLanguageCode = LanguageCodes.check(data.settings.language);
      } catch (_) {
      } finally {
        setLanguageCode(typedSelectedLanguageCode);
      }
    }
  }, [data?.settings.language]);

  return (
    <div className="relative px-6">
      {/* Banner */}
      <BubbleBanner />

      <motion.div
        className="relative z-10 pb-10 w-11/12 -mt-10 mx-auto"
        initial={AnimationStage.HIDDEN}
        animate={AnimationStage.VISIBLE}
        exit={AnimationStage.HIDDEN}
        variants={staggerChildrenAnimation}
      >
        <motion.div
          className="flex flex-row w-full gap-4 h-max"
          variants={childrenAnimation}
        >
          <UserAvatarCard
            className="w-1/3"
            isLoading={isLoading}
            username={data?.username || ""}
            role={data?.role.name || ""}
            position={data?.position.name || ""}
            department={data?.department.name || ""}
          />
          <UserDetailCard
            className="w-2/3"
            isLoading={isLoading}
            address={data?.address || ""}
            dateOfBirth={data?.dob || ""}
            email={data?.email || ""}
            fullName={data?.fullName || ""}
            phone={data?.phoneNumber || ""}
          />
        </motion.div>

        <motion.div
          className="mt-6 px-10 py-6 w-full h-max border rounded-lg bg-white shadow dark:bg-neutral-900 dark:border-neutral-900 dark:shadow-[0_0_15px_rgb(0,0,0,0.2)]"
          variants={childrenAnimation}
        >
          <p className="text-primary-500 font-extrabold text-xl dark:text-primary-600">
            Settings
          </p>

          <motion.div
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            exit={AnimationStage.HIDDEN}
            variants={staggerChildrenAnimation}
          >
            {data && (
              <>
                <motion.div
                  className="flex gap-3 mt-3"
                  variants={childrenAnimation}
                >
                  <p className="mt-2 text-[16px] font-bold opacity-50 w-[100px] dark:opacity-60">
                    Language
                  </p>
                  {isSuccess && data && (
                    <LanguageFilter
                      option={{
                        value: languageCode,
                        label: languages[languageCode].name,
                      }}
                      onChange={handleLanguageChange}
                    />
                  )}
                </motion.div>

                <motion.div
                  className="flex gap-3 mt-6"
                  variants={childrenAnimation}
                >
                  <p className="mt-2 text-[16px] font-bold opacity-50 w-[100px] dark:opacity-60">
                    Theme
                  </p>
                  {isSuccess && data && (
                    <ThemeFilter
                      option={{
                        value: themeCode,
                        label: themes[themeCode].name,
                      }}
                      onChange={handleThemeChange}
                    />
                  )}
                </motion.div>

                <motion.div
                  className="flex gap-3 mt-2.5"
                  variants={childrenAnimation}
                >
                  <p className="mt-6 text-[16px] font-bold opacity-50 w-[100px] dark:opacity-60">
                    Dark Mode
                  </p>
                  <div className="mt-5">
                    <Switch
                      size="lg"
                      checked={!data.settings.darkMode}
                      onChange={(e) => {
                        handleDarkModeChange(!e.currentTarget.checked);
                      }}
                    />
                  </div>
                </motion.div>

                <div>
                  <p className="mt-12 font-bold opacity-40 inline-block dark:opacity-30">
                    Need to change password?{" "}
                  </p>

                  <span className="ml-2 inline-block font-bold text-primary-500 hover:text-primary-600 underline dark:text-primary-700 dark:hover:text-primary-600 duration-200">
                    <Link to={`/profile/change-password/${data.userId}`}>
                      Click here
                    </Link>
                  </span>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
