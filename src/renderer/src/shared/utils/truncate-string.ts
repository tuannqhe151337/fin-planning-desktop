export const truncateString = (str?: string, length?: number) => {
  if (!length || !str) {
    return str;
  }

  if (str.length <= length) {
    return str;
  }

  if (str.length > length) {
    return str.substring(0, length) + "...";
  }
};
