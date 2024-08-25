import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export const useConvertNumberToMonthFn = () => {
  const { t, i18n } = useTranslation(["month"]);

  const convertNumberToMonth = useCallback(
    (month: string | number) => {
      if (typeof month === "string") {
        month = parseInt(month);
      }

      switch (month) {
        case 1:
          return t("January");
        case 2:
          return t("February");
        case 3:
          return t("March");
        case 4:
          return t("April");
        case 5:
          return t("May");
        case 6:
          return t("June");
        case 7:
          return t("July");
        case 8:
          return t("August");
        case 9:
          return t("September");
        case 10:
          return t("October");
        case 11:
          return t("November");
        case 12:
          return t("December");
        default:
          return month.toString();
      }
    },
    [t, i18n.language]
  );

  return convertNumberToMonth;
};
