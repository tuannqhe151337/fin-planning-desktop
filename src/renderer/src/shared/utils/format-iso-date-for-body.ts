import { fromZonedTime } from "date-fns-tz";

export const formatISODateForBody = (date: Date): string => {
  return fromZonedTime(date, "UTC").toISOString().replace("Z", "");
};
