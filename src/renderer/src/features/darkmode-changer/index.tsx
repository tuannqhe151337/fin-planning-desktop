import { MdDarkMode } from "react-icons/md";
import { IconButton } from "../../shared/icon-button";
import { useEffect, useState } from "react";
import { changeDarkmode } from "./utils/change-darkmode";
import {
  useMeQuery,
  useUserSettingMutation,
} from "../../providers/store/api/authApi";

export const DarkmodeChanger: React.FC = () => {
  // Darkmode state (detach from me because there's a case when user not logged in)
  const [isDarkmode, setIsDarkmode] = useState<boolean>(false);

  // Get data
  const { data: me } = useMeQuery();

  // Mutation
  const [updateUserSetting] = useUserSettingMutation();

  useEffect(() => {
    setIsDarkmode(me?.settings.darkMode || false);
  }, [me]);

  useEffect(() => {
    changeDarkmode(isDarkmode);
  }, [isDarkmode]);

  return (
    <IconButton
      containerClassName="z-30"
      tooltip="Dark/Light mode"
      onClick={() => {
        if (me) {
          updateUserSetting({
            theme: me.settings.theme,
            language: me.settings.language,
            darkMode: !isDarkmode,
          });
        }

        setIsDarkmode((prevState) => !prevState);
      }}
    >
      <MdDarkMode className="z-30 text-2xl text-primary-500 dark:text-primary-600" />
    </IconButton>
  );
};
