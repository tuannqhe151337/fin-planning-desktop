import { format, parseISO } from "date-fns";

export const formatISODateFromResponse = (date: string): string | null => {
  try {
    return format(parseISO(date, { additionalDigits: 2 }), "dd MMMM yyyy");
  } catch (ex) {
    return null;
  }
};
