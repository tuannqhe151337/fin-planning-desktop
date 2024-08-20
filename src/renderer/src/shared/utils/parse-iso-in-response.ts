import { parseISO } from "date-fns";

export const parseISOInResponse = (dateStr?: string): Date => {
  try {
    if (dateStr) {
      return parseISO(dateStr, { additionalDigits: 2 });
    } else {
      return new Date();
    }
  } catch (_) {
    return new Date();
  }
};
