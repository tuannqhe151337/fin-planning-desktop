import { format } from "date-fns";

export const formatDate = (date?: any, datePattern?: string) => {
  let result = "";

  if (!datePattern) {
    datePattern = "dd/MM/yyyy";
  }

  try {
    if (date instanceof Date) {
      result = format(date, datePattern);
    } else {
      result = format(new Date(), datePattern);
    }
  } catch {}

  return result;
};
