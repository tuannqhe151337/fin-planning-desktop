import { useMeQuery } from "../../providers/store/api/authApi";

export const useDetectDarkmode = () => {
  const { data } = useMeQuery();

  return data?.settings.darkMode;
};
