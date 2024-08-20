import { ThemeCode, ThemeCodes, themes } from "../../../type";

export const changeTheme = (selectedThemeCode: string) => {
  let typedSelectedThemeCode: ThemeCode = "blue";

  try {
    typedSelectedThemeCode = ThemeCodes.check(selectedThemeCode);
  } catch (_) {
  } finally {
    document.body.className = `${themes[typedSelectedThemeCode].themeClasses} font-nunito dark:bg-neutral-900 min-h-screen`;
  }
};
