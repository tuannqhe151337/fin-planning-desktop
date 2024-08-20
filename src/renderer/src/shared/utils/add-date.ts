import { add, Duration } from "date-fns";

export const addDate = (
  date: string | number | Date,
  duration: Duration
): Date => {
  try {
    return add(date, duration);
  } catch {
    return new Date();
  }
};
